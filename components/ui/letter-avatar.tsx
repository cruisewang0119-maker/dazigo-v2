'use client'

// Muted earthy color palette for avatar backgrounds (matching BuddyUp style)
const avatarColors = [
  'bg-[#B5AD8E]', // Olive/khaki
  'bg-[#C4A98A]', // Dusty beige
  'bg-[#A89F91]', // Warm gray
  'bg-[#9CAA9C]', // Sage green
  'bg-[#B8A99A]', // Dusty rose/mauve
  'bg-[#A8B5A0]', // Muted green
  'bg-[#C9BDA8]', // Sand
  'bg-[#ADA799]', // Taupe
]

// Generate consistent color based on name
function getColorFromName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

// Get first letter (supports Chinese characters)
function getInitial(name: string): string {
  const firstChar = name.charAt(0)
  // If it's a Chinese character, return it directly
  if (/[\u4e00-\u9fa5]/.test(firstChar)) {
    return firstChar
  }
  // Otherwise return uppercase English letter
  return firstChar.toUpperCase()
}

interface LetterAvatarProps {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  isOnline?: boolean
  className?: string
}

const sizeClasses = {
  xs: 'w-5 h-5 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-14 h-14 text-lg',
  '2xl': 'w-16 h-16 text-xl',
}

const onlineDotSizes = {
  xs: 'w-1.5 h-1.5 border',
  sm: 'w-2 h-2 border',
  md: 'w-2.5 h-2.5 border-2',
  lg: 'w-3 h-3 border-2',
  xl: 'w-3.5 h-3.5 border-2',
  '2xl': 'w-4 h-4 border-2',
}

export default function LetterAvatar({ 
  name, 
  size = 'md', 
  isOnline,
  className = '' 
}: LetterAvatarProps) {
  const bgColor = getColorFromName(name)
  const initial = getInitial(name)

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      <div 
        className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center text-white font-medium`}
      >
        {initial}
      </div>
      {isOnline !== undefined && isOnline && (
        <div 
          className={`absolute bottom-0 right-0 ${onlineDotSizes[size]} bg-green-500 rounded-full border-white`}
        />
      )}
    </div>
  )
}
