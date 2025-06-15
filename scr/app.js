import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image, Trophy, Settings, Eye, EyeOff, Lock, Home, ChevronRight, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gdjgdbwgwwfyokvbwghr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkamdkYndnd3dmeW9rdmJ3Z2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDg5OTIsImV4cCI6MjA2NTUyNDk5Mn0.iX1vN9LL0DOzXAaUUKe5MIlLjBI_KN2GRnUi8LT2LaE';

const supabase = createClient(supabaseUrl, supabaseKey);

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
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  
  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const { data: categories, error } = await supabase
        .from('categories')
        .select(`*, subcategories (*, characters (*))`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCategories(categories || []);
    } catch (error) {
      console.error('Error:', error);
      // بيانات تجريبية في حالة فشل التحميل
      setCategories([{
        id: '1', name: 'عينة تجريبية', icon: '🎮', color: 'from-blue-500 to-purple-500',
        subcategories: [{
          id: '1', name: 'فئة تجريبية',
          characters: [{ id: '1', name: 'شخصية تجريبية', image_url: 'https://via.placeholder.com/300?text=تجربة' }]
        }]
      }]);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    const name = prompt('اسم الفئة:');
    const icon = prompt('رمز الفئة:') || '📁';
    if (!name) return;

    try {
      const colors = ['from-blue-500 to-purple-500', 'from-green-500 to-teal-500', 'from-red-500 to-pink-500'];
      const { error } = await supabase.from('categories').insert([{
        name, icon, color: colors[Math.floor(Math.random() * colors.length)]
      }]);
      if (!error) {
        alert('تم إضافة الفئة بنجاح');
        loadCategories();
      }
    } catch (error) {
      alert('حدث خطأ');
    }
  };

  const addSubcategory = async (categoryId) => {
    const name = prompt('اسم الفئة الفرعية:');
    if (!name) return;

    try {
      const { error } = await supabase.from('subcategories').insert([{ category_id: categoryId, name }]);
      if (!error) {
        alert('تم إضافة الفئة الفرعية بنجاح');
        loadCategories();
      }
    } catch (error) {
      alert('حدث خطأ');
    }
  };

  const addCharacter = async (subcategoryId) => {
    const name = prompt('اسم الشخصية:');
    if (!name) return;
    const imageUrl = prompt('رابط الصورة:') || `https://via.placeholder.com/300?text=${name}`;

    try {
      const { error } = await supabase.from('characters').insert([{ subcategory_id: subcategoryId, name, image_url: imageUrl }]);
      if (!error) {
        alert('تم إضافة الشخصية بنجاح');
        loadCategories();
      }
    } catch (error) {
      alert('حدث خطأ');
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm('هل أنت متأكد؟')) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (!error) loadCategories();
    } catch (error) {
      alert('حدث خطأ');
    }
  };

  const deleteSubcategory = async (id) => {
    if (!confirm('هل أنت متأكد؟')) return;
    try {
      const { error } = await supabase.from('subcategories').delete().eq('id', id);
      if (!error) loadCategories();
    } catch (error) {
      alert('حدث خطأ');
    }
  };

  const deleteCharacter = async (id) => {
    if (!confirm('هل أنت متأكد؟')) return;
    try {
      const { error } = await supabase.from('characters').delete().eq('id', id);
      if (!error) loadCategories();
    } catch (error) {
      alert('حدث خطأ');
    }
  };

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
    } else {
      alert('كلمة مرور خاطئة');
      setAdminPassword('');
    }
  };

  const startGame = (category, subcategory) => {
    if (!subcategory.characters?.length) {
      alert('لا توجد شخصيات');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={handleLogoClick}>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full">
              <Trophy className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-600">تحدي الصور</h1>
              <p className="text-gray-500">اختبر معرفتك بالشخصيات</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {userMode === 'admin' && (
              <span className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium">
                وضع الإدارة
              </span>
            )}
            
            {userMode === 'admin' ? (
              <button
                onClick={() => {
                  setUserMode('user');
                  setGameMode('menu');
                }}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                خروج
              </button>
            ) : (
              gameMode !== 'menu' && (
                <button
                  onClick={() => {
                    setGameMode('menu');
                    setSelectedCategory(null);
                  }}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
                >
                  الرئيسية
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <Lock className="mx-auto text-red-500 mb-4" size={48} />
              <h2 className="text-2xl font-bold">دخول الإدارة</h2>
            </div>
            
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full p-4 border rounded-lg text-center mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            
            <div className="flex gap-3">
              <button onClick={handleAdminLogin} className="flex-1 bg-green-500 text-white py-3 rounded-lg">
                دخول
              </button>
              <button 
                onClick={() => setShowAdminLogin(false)}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {userMode === 'admin' ? (
        // Admin Panel
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">لوحة الإدارة</h2>
            <button onClick={addCategory} className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
              إضافة فئة
            </button>
          </div>

          {categories.map(category => (
            <div key={category.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{category.icon}</span>
                    <div>
                      <h3 className="text-2xl font-bold">{category.name}</h3>
                      <p>{category.subcategories?.length || 0} فئة فرعية</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => addSubcategory(category.id)}
                      className="bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30"
                    >
                      إضافة فئة فرعية
                    </button>
                    <button 
                      onClick={() => deleteCategory(category.id)}
                      className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {category.subcategories?.map(subcategory => (
                  <div key={subcategory.id} className="border rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="text-xl font-bold">{subcategory.name}</h4>
                        <p className="text-gray-500">{subcategory.characters?.length || 0} شخصية</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => addCharacter(subcategory.id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                          إضافة شخصية
                        </button>
                        <button 
                          onClick={() => deleteSubcategory(subcategory.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                          حذف
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {subcategory.characters?.map(character => (
                        <div key={character.id} className="bg-gray-50 rounded-xl p-3">
                          <img
                            src={character.image_url}
                            alt={character.name}
                            className="w-full h-24 object-cover rounded-lg mb-2"
                            onError={(e) => {
                              e.target.src = `https://via.placeholder.com/200?text=${character.name}`;
                            }}
                          />
                          <p className="text-sm text-center truncate">{character.name}</p>
                          <button
                            onClick={() => deleteCharacter(character.id)}
                            className="w-full mt-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                          >
                            حذف
                          </button>
                        </div>
                      )) || []}
                    </div>
                  </div>
                )) || []}
              </div>
            </div>
          ))}
        </div>
      ) : gameMode === 'menu' ? (
        // Categories View
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">اختر فئة التحدي</h2>
            <p className="text-gray-600">اختبر معرفتك في مختلف المجالات</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(category => (
              <div
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category);
                  setGameMode('subcategories');
                }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden hover:scale-105"
              >
                <div className={`bg-gradient-to-br ${category.color} p-8 text-center text-white`}>
                  <div className="text-6xl mb-4">{category.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p>{category.subcategories?.length || 0} فئة متاحة</p>
                </div>
                
                <div className="p-6">
                  {category.subcategories?.slice(0, 3).map(sub => (
                    <div key={sub.id} className="flex justify-between text-sm mb-2">
                      <span>{sub.name}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                        {sub.characters?.length || 0}
                      </span>
                    </div>
                  )) || []}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : gameMode === 'subcategories' ? (
        // Subcategories View
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setGameMode('menu')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight size={24} />
            </button>
            <div>
              <h2 className="text-3xl font-bold">{selectedCategory?.name}</h2>
              <p className="text-gray-600">اختر فئة فرعية لبدء التحدي</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedCategory?.subcategories?.map(subcategory => (
              <div
                key={subcategory.id}
                onClick={() => startGame(selectedCategory, subcategory)}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer p-6 hover:scale-105"
              >
                <div className="text-center">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Image size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{subcategory.name}</h3>
                  <p className="text-gray-600 mb-4">{subcategory.characters?.length || 0} شخصية</p>
                  
                  {(subcategory.characters?.length || 0) > 0 ? (
                    <div className="bg-blue-500 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-600">
                      ابدأ التحدي
                    </div>
                  ) : (
                    <div className="bg-gray-200 text-gray-500 py-3 px-6 rounded-lg">
                      لا توجد شخصيات
                    </div>
                  )}
                </div>
              </div>
            )) || []}
          </div>
        </div>
      ) : (
        // Game Interface
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className={`bg-gradient-to-r ${selectedCategory?.color} p-6 text-white text-center`}>
              <h2 className="text-xl font-bold">{selectedCategory?.name}</h2>
              <p>{selectedSubcategory?.name}</p>
            </div>

            {currentImage && (
              <div className="p-6">
                <div className="relative mb-6">
                  <img
                    src={currentImage.image_url}
                    alt="تحدي"
                    className="w-full h-80 object-cover rounded-2xl shadow-lg"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/400?text=${currentImage.name}`;
                    }}
                  />
                  {showAnswer && (
                    <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center rounded-2xl">
                      <div className="text-center text-white">
                        <div className="text-4xl mb-4">🎉</div>
                        <div className="text-3xl font-bold mb-2">{currentImage.name}</div>
                        <div className="text-lg opacity-75">الإجابة الصحيحة</div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                      showAnswer ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                    } text-white`}
                  >
                    {showAnswer ? <EyeOff size={24} /> : <Eye size={24} />}
                    {showAnswer ? 'إخفاء الإجابة' : 'إظهار الإجابة'}
                  </button>
                  
                  <button
                    onClick={getRandomImage}
                    className="w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3"
                  >
                    <Image size={24} />
                    صورة جديدة
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
