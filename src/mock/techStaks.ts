import type { TechStack } from '@/types/stack.types'
import { AiFillApi } from 'vue-icons-plus/ai'
import { BiLogoPostgresql } from 'vue-icons-plus/bi'
import { BsDatabaseFill } from 'vue-icons-plus/bs'
import {
  SiVuedotjs,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiGit,
  SiDocker,
  SiCss3,
  SiNextdotjs,
  SiSass,
  SiPython,
  SiDjango,
} from 'vue-icons-plus/si'

export const techStack: TechStack[] = [
  { techName: 'Java Script', icon: SiJavascript, color: '#f9dd1a' },
  { techName: 'Type Script', icon: SiTypescript, color: '#3178C6' },
  { techName: 'React', icon: SiReact, color: '#61dafb' },
  { techName: 'Next.js', icon: SiNextdotjs, color: '#ffffff' },
  { techName: 'Vue.js', icon: SiVuedotjs, color: '#4FC08D' },
  { techName: 'CSS3', icon: SiCss3, color: '#275fe8' },
  { techName: 'Tailwind CSS', icon: SiTailwindcss, color: '#00bcff' },
  { techName: 'Sass', icon: SiSass, color: '#cc6699' },
  { techName: 'RestAPI', icon: AiFillApi, color: '#ffd43b' },
  { techName: 'Node.js', icon: SiNodedotjs, color: '#339933' },
  { techName: 'Python', icon: SiPython, color: '#326b9b' },
  { techName: 'Express.js', icon: SiExpress, color: '#ffffff' },
  { techName: 'Django', icon: SiDjango, color: '#44b78b' },
  { techName: 'SQL', icon: BsDatabaseFill, color: '#ffd43b' },
  { techName: 'PostgreSQL', icon: BiLogoPostgresql, color: '#679cc7' },
  { techName: 'Git', icon: SiGit, color: '#f05133' },
  { techName: 'Docker', icon: SiDocker, color: '#2560ff' },
]
