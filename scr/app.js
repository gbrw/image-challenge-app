import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Play, Home, Eye, EyeOff, ArrowLeft } from 'lucide-react';

// بيانات تجريبية
const sampleData = [
  {
    id: '1',
    name: 'مسلسلات وأفلام',
    icon: '🎬',
    color: 'from-purple-500 to-pink-500',
    subcategories: [
      {
        id: '1',
        name: 'باب الحارة',
        characters: [
          { id: '1', name: 'أبو عصام', image_url: 'https://via.placeholder.com/300x300?text=أبو+عصام&bg=4A90E2&color=white' },
          { id: '2', name: 'معتز', image_url: 'https://via.placeholder.com/300x300?text=معتز&bg=50C878&color=white' }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'نجوم الرياضة',
    icon: '⚽',
    color: 'from-green-500 to-blue-500',
    subcategories: [
      {
        id: '2',
        name: 'كرة القدم',
        characters: [
          { id: '3', name: 'محمد صلاح', image_url: 'https://via.placeholder.com/300x300?text=محمد+صلاح&bg=E74C3C&color=white' }
        ]
      }
    ]
  }
];

function App() {
  const [userMode, setUserMode] = useState('user');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [gameMode, setGameMode] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [categories, setCategories] = useState(sampleData);

  const ADMIN_PASSWORD = "admin123";

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount >= 4) {
      setShowAdminLogin(true);
      setClickCount(0);
    }
    setTimeout(() => setClickCount(0), 3000);
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setUserMode('admin');
      setShowAdminLogin(false);
      setAdminPassword('');
      alert('مرحباً بك في وضع الإدارة!');
    } else {
      alert('كلمة مرور خاطئة');
      setAdminPassword('');
    }
  };

  const startGame = (category, subcategory) => {
    if (!subcategory.characters?.length) {
      alert('لا توجد شخصيات في هذه الفئة');
      return;
    }
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    const randomCharacter = subcategory.characters[Math.floor(Math.random() * subcategory.characters.length)];
    setCurrentImage(randomCharacter);
    setShowAnswer(false);
    setGameMode('playing');
  };

  const getRandomImage = () => {
    if (selectedSubcategory?.characters?.length) {
      const randomCharacter = selectedSubcategory.characters[Math.floor(Math.random() * selectedSubcategory.characters.length)];
      setCurrentImage(randomCharacter);
      setShowAnswer(false);
    }
  };

  const addCategory = () => {
    const name = prompt('اسم الفئة الجديدة:');
    const icon = prompt('رمز الفئة (emoji):') || '📁';
    if (!name) return;

    const colors = ['from-blue-500 to-purple-500', 'from-green-500 to-teal-500', 'from-red-500 to-pink-500'];
    const newCategory = {
      id: Date.now().toString(),
      name,
      icon,
      color: colors[Math.floor(Math.random() * colors.length)],
      subcategories: []
    };

    setCategories(prev => [...prev, newCategory]);
    alert('تم إضافة الفئة بنجاح!');
  };

  const addSubcategory = (categoryId) => {
    const name = prompt('اسم الفئة الفرعية:');
    if (!name) return;

    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: [...(cat.subcategories || []), {
            id: Date.now().toString(),
            name,
            characters: []
          }]
        };
      }
      return cat;
    }));
    alert('تم إضافة الفئة الفرعية بنجاح!');
  };

  const addCharacter = (categoryId, subcategoryId) => {
    const name = prompt('اسم الشخصية:');
    if (!name) return;
    const imageUrl = prompt('رابط الصورة:') || 
      `https://via.placeholder.com/300x300?text=${encodeURIComponent(name)}&bg=${Math.floor(Math.random()*16777215).toString(16)}&color=white`;

    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: cat.subcategories.map(sub => {
            if (sub.id === subcategoryId) {
              return {
                ...sub,
                characters: [...(sub.characters || []), {
                  id: Date.now().toString(),
                  name,
                  image_url: imageUrl
                }]
              };
            }
            return sub;
          })
        };
      }
      return cat;
    }));
    alert('تم إضافة الشخصية بنجاح!');
  };

  const deleteCharacter = (categoryId, subcategoryId, characterId) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشخصية؟')) return;

    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: cat.subcategories.map(sub => {
            if (sub.id === subcategoryId) {
              return {
                ...sub,
                characters: sub.characters.filter(char => char.id !== characterId)
              };
            }
            return sub;
          })
        };
      }
      return cat;
    }));
  };

  // Admin Login Modal
  if (showAdminLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">تسجيل دخول الإدارة</h2>
          <input
            type="password"
            placeholder="كلمة المرور"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-right"
            onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
          />
          <div className="flex gap-3">
            <button
              onClick={handleAdminLogin}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              دخول
            </button>
            <button
              onClick={() => {setShowAdminLogin(false); setAdminPassword(''); setClickCount(0);}}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game Playing Mode
  if (gameMode === 'playing' && currentImage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setGameMode('menu')}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              القائمة الرئيسية
            </button>
            <h1 className="text-2xl font-bold text-white">
              {selectedCategory?.name} - {selectedSubcategory?.name}
            </h1>
          </div>

          {/* Image Card */}
          <div className="bg-white rounded-xl shadow-2xl p-6 text-center mb-6">
            <img
              src={currentImage.image_url}
              alt="صورة الشخصية"
              className="w-full max-w-md mx-auto rounded-lg shadow-lg mb-4"
            />
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                {showAnswer ? <EyeOff size={20} /> : <Eye size={20} />}
                {showAnswer ? 'إخفاء الاسم' : 'إظهار الاسم'}
              </button>
              <button
                onClick={getRandomImage}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Play size={20} />
                صورة جديدة
              </button>
            </div>
            {showAnswer && (
              <div className="mt-4 p-4 bg-green-100 rounded-lg">
                <p className="text-xl font-bold text-green-800">{currentImage.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Menu
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                onClick={handleLogoClick}
                className="text-4xl cursor-pointer hover:scale-110 transition-transform"
              >
                🎯
              </div>
              <h1 className="text-3xl font-bold text-white">تحدي الصور</h1>
            </div>
            <div className="flex items-center gap-3">
              {userMode === 'admin' && (
                <>
                  <button
                    onClick={addCategory}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus size={20} />
                    إضافة فئة
                  </button>
                  <button
                    onClick={() => setUserMode('user')}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    خروج من الإدارة
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`bg-gradient-to-br ${category.color} rounded-xl shadow-xl overflow-hidden`}
            >
              <div className="p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    <h2 className="text-xl font-bold">{category.name}</h2>
                  </div>
                  {userMode === 'admin' && (
                    <button
                      onClick={() => addSubcategory(category.id)}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {category.subcategories?.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      className="bg-white/20 rounded-lg p-3 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{subcategory.name}</h3>
                          <p className="text-sm opacity-80">
                            {subcategory.characters?.length || 0} شخصية
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {userMode === 'admin' && (
                            <button
                              onClick={() => addCharacter(category.id, subcategory.id)}
                              className="bg-white/20 hover:bg-white/30 p-1 rounded transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => startGame(category, subcategory)}
                            className="bg-white/30 hover:bg-white/40 px-3 py-1 rounded transition-colors"
                          >
                            ابدأ
                          </button>
                        </div>
                      </div>

                      {userMode === 'admin' && subcategory.characters?.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {subcategory.characters.map((character) => (
                            <div
                              key={character.id}
                              className="flex items-center justify-between bg-white/10 rounded px-2 py-1 text-sm"
                            >
                              <span>{character.name}</span>
                              <button
                                onClick={() => deleteCharacter(category.id, subcategory.id, character.id)}
                                className="text-red-300 hover:text-red-100 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
