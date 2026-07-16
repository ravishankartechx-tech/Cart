import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiUser, HiPhone, HiMail, HiLocationMarker, HiPlus, HiPencil, HiCheck } from 'react-icons/hi';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateProfile(form);
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const STATS = [
    { label: 'Orders', value: '24' },
    { label: 'Saved', value: '138 ₹' },
    { label: 'Reviews', value: '8' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
          {/* Cover */}
          <div className="h-24 gradient-primary relative">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_50%,white,transparent)]" />
          </div>

          <div className="px-6 pb-6 -mt-12">
            {/* Avatar */}
            <div className="flex items-end justify-between mb-4">
              <div className="relative">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-24 h-24 rounded-2xl border-4 border-white dark:border-gray-800 object-cover shadow-lg" />
                ) : (
                  <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-gray-800 gradient-primary flex items-center justify-center text-white text-4xl font-black shadow-lg">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center shadow-sm">
                  <HiPencil className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <button onClick={() => editing ? handleSave() : setEditing(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  editing ? 'bg-green-500 text-white hover:bg-green-600' : 'border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-[#ff5200] hover:text-[#ff5200]'
                }`}
                disabled={saving}
              >
                {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> :
                 saved ? <HiCheck className="w-4 h-4" /> :
                 editing ? <HiCheck className="w-4 h-4" /> : <HiPencil className="w-4 h-4" />}
                {saved ? 'Saved!' : editing ? 'Save' : 'Edit Profile'}
              </button>
            </div>

            {editing ? (
              <div className="space-y-3">
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="input-base text-sm" placeholder="Full Name" />
                <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="input-base text-sm" placeholder="Phone Number" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-gray-900 dark:text-white">{user?.name}</h2>
                  {user?.role !== 'user' && (
                    <span className="badge badge-orange capitalize">{user?.role}</span>
                  )}
                </div>
                <div className="space-y-1.5 mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <HiMail className="w-4 h-4 text-[#ff5200]" /> {user?.email}
                  </div>
                  {user?.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <HiPhone className="w-4 h-4 text-[#ff5200]" /> {user?.phone}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {STATS.map(s => (
            <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 text-center">
              <p className="text-2xl font-black text-[#ff5200]">{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Saved Addresses */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <h3 className="font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <HiLocationMarker className="w-5 h-5 text-[#ff5200]" /> Saved Addresses
          </h3>

          {user?.addresses && user.addresses.length > 0 ? (
            <div className="space-y-3">
              {user.addresses.map((addr, i) => (
                <div key={i} className="flex items-start justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{addr.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{addr.street}, {addr.city} - {addr.pincode}</p>
                  </div>
                  <button className="text-gray-400 hover:text-[#ff5200] transition-colors">
                    <HiPencil className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No saved addresses yet.</p>
          )}

          <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:border-[#ff5200] hover:text-[#ff5200] transition-colors">
            <HiPlus className="w-4 h-4" /> Add New Address
          </button>
        </div>

        {/* Account options */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {[
            { label: 'Order History', emoji: '📦', href: '/orders' },
            { label: 'Payment Methods', emoji: '💳', href: '#' },
            { label: 'Notifications', emoji: '🔔', href: '#' },
            { label: 'Help & Support', emoji: '🤝', href: '#' },
          ].map((item, i) => (
            <a key={i} href={item.href}
              className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
              <span className="text-xl">{item.emoji}</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{item.label}</span>
              <span className="ml-auto text-gray-400">›</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
