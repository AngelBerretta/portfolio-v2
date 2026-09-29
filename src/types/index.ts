export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  codeUrl: string;
  demoUrl: string;
  category: 'fullstack' | 'frontend' | 'landing';
  featured?: boolean;
  status?: 'live' | 'coming-soon' | 'in-progress';
  statusLabel?: string;
}

export interface Skill {
  name: string;
  level: number;
  category: string;
  icon: string;
}

export interface NavItem {
  label: string;
  href: string;
}
