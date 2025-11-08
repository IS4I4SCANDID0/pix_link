/**
 * Calcula o valor CRC-16 (Cyclic Redundancy Check) para o payload do PIX.
 * Usa o polinômio EMV (0x1021).
 * @param {string} payload - O payload PIX sem o campo CRC (ID 63).
 * @returns {string} - O valor CRC-16 em formato hexadecimal (4 caracteres).
 */

const calculateCRC16 = (payload: string): string => {
  // Inicializa o valor do 0xFFFF
  let crc = 0xffff
  const data = payload

  // Itera sobre cada byte dos caracteres payload
  for (let i = 0; i < data.length; i++) {
    // Obtém o valor ASCII do caractere
    crc ^= data.charCodeAt(i) << 8

    // Processa cada bit(8bits)
    for (let j = 0; j < 8; j++) {
      // Se o bit mais significativo (MSB) for 1, faça a XOR com o polinômio
      if (crc & 0x8000) {
        //  Polinômio EMV:0x1021
        crc = (crc << 1) ^ 0x1021
      } else {
        crc <<= 1
      }
    }
  }
  // Retorna o valor CRC-16 em formato hexadecimal (4 caracteres)
  crc &= 0xffff // Garante que o valor seja de 16 bits

  // Converte para hexadecimal, adiciona zeros à esquerda se necessário, e converte para maiúsculas
  let crcHex = crc.toString(16).toUpperCase()

  return crcHex.padStart(4, '0')
}

/**
 * Formata um campo PIX (ID + LENGTH + VALUE).
 * @param {string} id - O ID do campo (ex: '26').
 * @param {string} value - O valor do campo.
 * @returns {string} ID + LENGTH + VALUE (ex: '2605chave').
 */

const formatField = (id: string, value: string): string => {
  // Garante que o LENGTH tenha sempre 2 dígitos (e.g., 5 -> "05", 12 -> "12")
  const length = String(value.length).padStart(2, '0')
  return `${id}${length}${value}`
}

/**
 * Formata o valor monetário.
 * @param {number} amount - Valor em reais.
 * @returns {string} Valor formatado com 2 casas decimais.
 */

const formatAmount = (amount: number): string => {
  if (amount === undefined || amount === null || isNaN(amount) || amount <= 0) {
    return ''
  }
  // Formata o valor para string com 2 casas decimais (ex: 10.5 -> "10.50")
  return amount.toFixed(2)
}

/**
 * Gera o Payload completo do QR Code PIX (string EMV).
 * * @param {string} pixKey - Chave PIX (e-mail, CPF, telefone ou aleatória).
 * @param {string} merchantName - Nome do recebedor (Streamer).
 * @param {string} merchantCity - Cidade do recebedor (máx. 15 caracteres).
 * @param {number} [amount] - Valor da transação (opcional, para doação fixa).
 * @param {string} [txid='***'] - ID da transação (usamos *** como padrão não rastreável).
 * @returns {string} O Payload EMV completo.
 */
const generatePixPayload = (
  pixKey: string,
  merchantName: string,
  merchantCity: string,
  amount: number | string,
  txid = '***',
) => {
  // 1. CONSTRUÇÃO DO CAMPO 26: Merchant Account Information
  // Subcampo 00: GUID obrigatório do PIX
  const guiField = formatField('00', 'br.gov.bcb.pix') // ID 00: 14 digitos

  // Subcampo 01: Chave PIX
  const keyField = formatField('01', pixKey)

  // O Campo 26 completo é a concatenação dos subcampos 00 e 01
  const field26Value = guiField + keyField
  const field26 = formatField('26', field26Value)

  // 2. CONSTRUÇÃO DO CAMPO 62: Additional Data Field (TXID)
  const txidField = formatField('05', txid) // ID 05: TXID
  const field62 = formatField('62', txidField)

  // 3. MONTAGEM DA STRING PRINCIPAL (Payload Parcial)
  let payload = ''

  // ID 00: Payload Format Indicator (01 - Fixo)
  payload += formatField('00', '01')

  // ID 01: Point of Initiation Method (12 - valor não reutilizável)
  payload += formatField('01', '12')

  // ID 26: Merchant Account Information (a chave PIX)
  payload += field26

  // ID 52: Merchant Category Code (0000 - Fixo)
  payload += formatField('52', '0000')

  // ID 53: Transaction Currency (986 - BRL)
  payload += formatField('53', '986')

  // ID 54: Transaction Amount (opcional)
  const formattedAmount = formatAmount(Number(amount))
  if (formattedAmount) {
    payload += formatField('54', formattedAmount)
  }

  // ID 58: Country Code (BR - Brasil)
  payload += formatField('58', 'BR')

  // ID 59: Merchant Name
  payload += formatField('59', merchantName)

  // ID 60: Merchant City(máximo 15 caracteres)
  payload += formatField('60', merchantCity)

  // ID 62: Additional Data Field (TXID)
  payload += field62

  // 4. CÁLCULO DO CRC16 E ADIÇÃO CRC16 (CAMPO ID 63)
  // O CRC-16 deve ser calculado sobre toda a string acima MAIS o próprio ID e LENGTH do campo 63 (6304)
  const crc16data = payload + '6304'
  const crcValue = calculateCRC16(crc16data)

  // ID 63: Anexa o campo CRC-16 completo
  payload += formatField('63', crcValue)

  return payload
}

export default generatePixPayload
