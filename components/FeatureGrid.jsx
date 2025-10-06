import { 
  ShieldCheckIcon, 
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ClockIcon,
  StarIcon,
  CpuChipIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  DocumentTextIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    title: "Mehrere Kategorien",
    description: "Erstelle unbegrenzte Ticket-Kategorien für verschiedene Support-Bereiche",
    icon: ShieldCheckIcon,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Rollenverwaltung", 
    description: "Füge ganze Rollen zu Tickets hinzu oder entferne sie mit einem Klick",
    icon: UserGroupIcon,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Ticket-Backups",
    description: "Sichere geschlossene Tickets automatisch in einem dedizierten Kanal", 
    icon: DocumentTextIcon,
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Multi-Server",
    description: "Nutze den Bot auf mehreren Servern mit unabhängigen Konfigurationen",
    icon: CpuChipIcon,
    color: "from-orange-500 to-red-500"
  },
  {
    title: "🤖 KI-Chat System",
    description: "3 KI-Modi: ChatGPT, Coding-Hilfe & General. Automatische Antworten auf Nachrichten",
    icon: ChatBubbleLeftRightIcon,
    color: "from-cyan-500 to-blue-500",
    isNew: true
  },
  {
    title: "📋 AutoResponder/FAQ",
    description: "Automatische Antworten auf Keywords. Hybrid-Modus mit KI-Integration",
    icon: QuestionMarkCircleIcon,
    color: "from-yellow-500 to-orange-500",
    isNew: true
  },
  {
    title: "📊 Live Analytics",
    description: "Detaillierte Statistiken: Tickets, Feedback, User-Aktivität, Kategorien",
    icon: ChartBarIcon,
    color: "from-pink-500 to-rose-500",
    isNew: true
  },
  {
    title: "⏰ Auto-Close Timer",
    description: "Tickets schließen automatisch nach Inaktivität. Konfigurierbare Warnung",
    icon: ClockIcon,
    color: "from-indigo-500 to-purple-500",
    isNew: true
  },
  {
    title: "⭐ Feedback-System",
    description: "5-Sterne Bewertungen mit Kommentaren. Automatische Statistiken",
    icon: StarIcon,
    color: "from-amber-500 to-yellow-500",
    isNew: true
  },
  {
    title: "🔔 Reminder-System", 
    description: "Support-Todos und Termine verwalten. Flexible Zeitformate",
    icon: BellIcon,
    color: "from-teal-500 to-green-500",
    isNew: true
  },
  {
    title: "🔒 Erweiterte Berechtigungen",
    description: "Blacklist/Whitelist für User & Rollen. Granulare Zugriffskontrollen",
    icon: ShieldCheckIcon,
    color: "from-red-500 to-pink-500",
    isNew: true
  },
  {
    title: "📚 Knowledge Base",
    description: "Umfassendes Hilfe-System mit 8 Themenbereichen und interaktiver Navigation",
    icon: QuestionMarkCircleIcon,
    color: "from-violet-500 to-purple-500",
    isNew: true
  }
]

export default function FeatureGrid() {
  return (
    <div className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Alle Features im Überblick
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Der ultimative Discord Ticket-Bot mit KI-Integration, AutoResponder und Enterprise-Features
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="relative group cursor-pointer"
            >
              {/* New Badge */}
              {feature.isNew && (
                <div className="absolute -top-2 -right-2 z-10">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-400 to-blue-500 text-white">
                    NEW
                  </span>
                </div>
              )}
              
              {/* Card */}
              <div className="relative h-full p-6 bg-gray-800 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Hover Effect Line */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              20+
            </div>
            <div className="text-gray-400 text-sm">Commands</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
              3
            </div>
            <div className="text-gray-400 text-sm">KI-Modi</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
              ∞
            </div>
            <div className="text-gray-400 text-sm">Server</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
              100%
            </div>
            <div className="text-gray-400 text-sm">Kostenlos</div>
          </div>
        </div>
      </div>
    </div>
  )
}