import { CheckCircle2, Linkedin, Instagram, Mail, MapPin, Facebook, Youtube, Megaphone, FileText, Users } from "lucide-react"

// Custom SVG Components for exact brand matching
const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const RedditLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
)

const PinterestLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z"/>
  </svg>
)

const PLATFORMS = [
  { 
    id: 'instagram', 
    name: 'Instagram / TikTok', 
    icon: Instagram, 
    color: 'group-hover:text-pink-500',
    desc: 'Visuals & Short Video'
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: Linkedin, 
    color: 'group-hover:text-blue-600',
    desc: 'B2B & Professional'
  },
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: Facebook, 
    color: 'group-hover:text-blue-500',
    desc: 'Groups & Community'
  },
  { 
    id: 'google', 
    name: 'Google / SEO', 
    icon: MapPin, 
    color: 'group-hover:text-emerald-500',
    desc: 'Search Traffic'
  },
  { 
    id: 'content', 
    name: 'Blog / Content', 
    icon: FileText, 
    color: 'group-hover:text-indigo-400',
    desc: 'Long-form Writing'
  },
  { 
    id: 'email', 
    name: 'Email Marketing', 
    icon: Mail, 
    color: 'group-hover:text-yellow-400',
    desc: 'Lead Capture & Nurture' // Changed from Retention
  },
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: Youtube, 
    color: 'group-hover:text-red-500',
    desc: 'Long-form Video'
  },
  { 
    id: 'twitter', 
    name: ' X', 
    icon: XLogo, // Using custom SVG
    color: 'group-hover:text-slate-200',
    desc: 'Real-time Updates'
  },
  // New Fun Option
  { 
    id: 'guerrilla', 
    name: 'Guerrilla Marketing', 
    icon: Megaphone, 
    color: 'group-hover:text-orange-500',
    desc: 'Creative Stunts & PR' 
  },
  { 
    id: 'reddit', 
    name: 'Reddit / Forums', 
    icon: RedditLogo, 
    color: 'group-hover:text-orange-500',
    desc: 'Niche Communities' 
  },
  { 
    id: 'pinterest', 
    name: 'Pinterest', 
    icon: PinterestLogo, 
    color: 'group-hover:text-red-600',
    desc: 'Visual Discovery & Shopping' 
  },
  { 
    id: 'influencer', 
    name: 'Influencer Marketing', 
    icon: Users, 
    color: 'group-hover:text-purple-500',
    desc: 'Influencer & Partnerships' 
  }
]

export default function StepPlatforms({ formData, updateFormData }: any) {
  const togglePlatform = (id: string) => {
    const current = formData.preferredPlatforms || []
    const updated = current.includes(id) 
      ? current.filter((p: string) => p !== id)
      : [...current, id]
    updateFormData('preferredPlatforms', updated)
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold text-white">Where are your customers?</h2>
        <p className="text-slate-400 text-lg">Select the channels you want to dominate.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLATFORMS.map(p => {
          const isSelected = formData.preferredPlatforms?.includes(p.id)
          const Icon = p.icon
          
          return (
            <div 
              key={p.id}
              onClick={() => togglePlatform(p.id)}
              className={`
                relative cursor-pointer p-6 rounded-3xl border-2 transition-all duration-200 group flex flex-col gap-4 h-32 justify-center
                ${isSelected 
                  ? 'bg-lime-500/10 border-lime-400 shadow-[0_0_30px_-10px_rgba(132,204,22,0.4)]' 
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-600 hover:bg-slate-800'
                }
              `}
            >
              <div className="flex items-center justify-between w-full">
                 <div className={`p-3 rounded-2xl bg-slate-950 border border-white/5 ${isSelected ? 'text-lime-400' : 'text-slate-500'} ${p.color} transition-colors`}>
                    <Icon className="w-6 h-6" />
                 </div>
                 
                 {isSelected ? (
                    <div className="bg-lime-400 rounded-full p-1">
                        <CheckCircle2 className="w-4 h-4 text-black fill-lime-400" />
                    </div>
                 ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-800 group-hover:border-slate-600" />
                 )}
              </div>
              
              <div>
                <span className={`font-bold text-base block ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {p.name}
                </span>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wide mt-1 block">
                    {p.desc}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      
      <p className="text-center text-xs text-slate-500 pt-4">
        Don't see your exact niche? Select the closest fit or "Guerrilla" for creative ideas.
      </p>
    </div>
  )
}