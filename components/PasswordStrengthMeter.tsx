'use client'

interface PasswordStrengthMeterProps {
  password: string
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const calculateStrength = (pwd: string): { score: number; level: string; color: string; requirements: { met: boolean; label: string }[] } => {
    let score = 0
    
    const requirements = [
      { pattern: /.{8,}/, label: 'Al menos 8 caracteres' },
      { pattern: /[a-z]/, label: 'Letras minúsculas' },
      { pattern: /[A-Z]/, label: 'Letras mayúsculas' },
      { pattern: /[0-9]/, label: 'Números' },
      { pattern: /[!@#$%^&*]/, label: 'Caracteres especiales (!@#$%^&*)' },
    ]

    const checkedRequirements = requirements.map(req => ({
      ...req,
      met: req.pattern.test(pwd),
    }))

    score = checkedRequirements.filter(req => req.met).length
    
    let level = 'Muy débil'
    let color = 'bg-red-500'

    if (score === 0) {
      level = 'Muy débil'
      color = 'bg-red-500'
    } else if (score === 1) {
      level = 'Débil'
      color = 'bg-orange-500'
    } else if (score === 2) {
      level = 'Moderada'
      color = 'bg-yellow-500'
    } else if (score === 3) {
      level = 'Buena'
      color = 'bg-lime-500'
    } else {
      level = 'Muy fuerte'
      color = 'bg-green-500'
    }

    return { score, level, color, requirements: checkedRequirements }
  }

  if (!password) return null

  const { score, level, color, requirements } = calculateStrength(password)
  const percentage = (score / 5) * 100

  return (
    <div className="space-y-2 mt-2">
      {/* Strength Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${color} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          {level}
        </span>
      </div>

      {/* Requirements */}
      <div className="text-sm space-y-1">
        {requirements.map((req, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 text-xs transition-colors ${
              req.met ? 'text-green-600' : 'text-muted-foreground'
            }`}
          >
            <div
              className={`w-3 h-3 rounded-sm border ${
                req.met
                  ? 'bg-green-600 border-green-600'
                  : 'border-gray-300 bg-transparent'
              }`}
            >
              {req.met && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </div>
            {req.label}
          </div>
        ))}
      </div>
    </div>
  )
}
