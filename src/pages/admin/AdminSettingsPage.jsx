import { useState } from 'react'
import { Save, Bell, Lock, BarChart3, Zap } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/utils/cn'

const SETTINGS_SECTIONS = [
  {
    title: 'Store Settings',
    icon: BarChart3,
    settings: [
      { key: 'storeName', label: 'Store Name', type: 'text', value: 'Frill Custom Apparel' },
      { key: 'storeEmail', label: 'Store Email', type: 'email', value: 'support@frill.pk' },
      { key: 'storePhone', label: 'Store Phone', type: 'tel', value: '+92-300-1234567' },
      { key: 'currency', label: 'Currency', type: 'select', value: 'PKR', options: ['PKR', 'USD', 'EUR'] },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    settings: [
      { key: 'emailNotifs', label: 'Email Notifications', type: 'toggle', value: true },
      { key: 'orderNotifs', label: 'Order Alerts', type: 'toggle', value: true },
      { key: 'reviewNotifs', label: 'Review Notifications', type: 'toggle', value: true },
      { key: 'newsEmail', label: 'Marketing Emails', type: 'toggle', value: false },
    ],
  },
  {
    title: 'Security',
    icon: Lock,
    settings: [
      { key: 'twoFactor', label: 'Two-Factor Authentication', type: 'toggle', value: false },
      { key: 'sessionTimeout', label: 'Session Timeout (minutes)', type: 'number', value: 30 },
      { key: 'ipWhitelist', label: 'IP Whitelist', type: 'textarea', value: '192.168.1.0\n10.0.0.0' },
    ],
  },
  {
    title: 'Performance',
    icon: Zap,
    settings: [
      { key: 'cacheDuration', label: 'Cache Duration (hours)', type: 'number', value: 24 },
      { key: 'maxUploadSize', label: 'Max Upload Size (MB)', type: 'number', value: 50 },
      { key: 'enableCDN', label: 'Enable CDN', type: 'toggle', value: true },
      { key: 'autoBackup', label: 'Auto Backup Daily', type: 'toggle', value: true },
    ],
  },
]

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState(
    SETTINGS_SECTIONS.reduce((acc, section) => {
      section.settings.forEach(s => {
        acc[s.key] = s.value
      })
      return acc
    }, {})
  )
  const [isSaving, setIsSaving] = useState(false)

  function updateSetting(key, value) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsSaving(false)
    toast.success('Settings saved successfully')
  }

  function renderSettingControl(setting) {
    const value = settings[setting.key]

    switch (setting.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <input
            type={setting.type}
            value={value}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            className="w-full border border-brand-border rounded-frill px-3 py-2 text-sm focus:outline-none focus:border-purple"
          />
        )
      
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => updateSetting(setting.key, parseInt(e.target.value))}
            className="w-full border border-brand-border rounded-frill px-3 py-2 text-sm focus:outline-none focus:border-purple"
          />
        )
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            className="w-full border border-brand-border rounded-frill px-3 py-2 text-sm focus:outline-none focus:border-purple"
          >
            {setting.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )
      
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            className="w-full border border-brand-border rounded-frill px-3 py-2 text-sm focus:outline-none focus:border-purple min-h-20"
          />
        )
      
      case 'toggle':
        return (
          <button
            onClick={() => updateSetting(setting.key, !value)}
            className={cn(
              'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
              value ? 'bg-green-500' : 'bg-gray-300'
            )}
          >
            <span
              className={cn(
                'inline-block h-6 w-6 transform rounded-full bg-white transition-transform',
                value ? 'translate-x-7' : 'translate-x-1'
              )}
            />
          </button>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-head text-2xl font-black text-purple">Settings</h1>
          <p className="text-sm text-frill-600 mt-1">Manage store configuration and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-purple text-white rounded-frill px-6 py-2.5 font-head text-xs font-bold uppercase tracking-wide hover:bg-magenta disabled:opacity-60 transition-colors"
        >
          <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {SETTINGS_SECTIONS.map((section) => {
          const SectionIcon = section.icon
          return (
            <div key={section.title} className="bg-white border border-brand-border rounded-frill overflow-hidden shadow-sm">
              
              {/* Section Header */}
              <div className="bg-linear-to-r from-purple/10 to-magenta/10 border-b border-brand-border px-6 py-4 flex items-center gap-3">
                <SectionIcon size={20} className="text-purple" />
                <h2 className="font-head text-lg font-bold text-purple">{section.title}</h2>
              </div>

              {/* Section Content */}
              <div className="p-6 space-y-5">
                {section.settings.map((setting) => (
                  <div key={setting.key} className="flex flex-col gap-2">
                    <label className="font-head text-xs font-bold uppercase tracking-wider text-frill-600">
                      {setting.label}
                    </label>
                    <div className="flex items-center gap-3">
                      {renderSettingControl(setting)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border-2 border-red-200 rounded-frill p-6">
        <h3 className="font-head text-lg font-bold text-red-700 mb-3">Danger Zone</h3>
        <p className="text-sm text-red-600 mb-4">These actions cannot be undone.</p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-red-500 text-white rounded-frill font-head text-xs font-bold uppercase tracking-wide hover:bg-red-600 transition-colors">
            Clear All Cache
          </button>
          <button className="px-4 py-2 border border-red-300 text-red-700 rounded-frill font-head text-xs font-bold uppercase tracking-wide hover:bg-red-50 transition-colors">
            Export Database
          </button>
        </div>
      </div>

      {/* Footer Note */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-frill">
        <p className="text-sm text-blue-700">
          <strong>💡 Tip:</strong> Settings are saved to a local configuration file. Some changes require a server restart.
        </p>
      </div>
    </div>
  )
}
