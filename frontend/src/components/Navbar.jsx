import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets.js";
import {
  Menu,
  User,
  X,
  Search,
  Bell,
  Calendar,
  Stethoscope,
  Home,
  Info,
  Phone,
  Bot,
  Zap,
  Lock
} from "lucide-react";
import toast from "react-hot-toast";
import aiService from "../services/aiService";

const Navbar = () => {
  const { navigate, user, setUser, doctor } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const location = useLocation();

  const menus = [
    { name: "Home", link: "/", icon: Home },
    { name: "Doctors", link: "/doctors", icon: Stethoscope },
    { name: "Services", link: "/services", icon: Zap },
    { name: "About", link: "/about", icon: Info },
    { name: "Contact", link: "/contact", icon: Phone },
  ];

  // AI Assistant State
  const [aiMessages, setAiMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your medical assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [aiInput, setAiInput] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success("Logout successful.");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/doctors?search=${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleAIMessage = async () => {
    if (!aiInput.trim()) return;

    console.log('Processing AI query:', aiInput);

    // Add user message
    const userMessage = { role: 'user', content: aiInput, timestamp: new Date() };
    setAiMessages(prev => [...prev, userMessage]);

    try {
      // Process with real AI service
      console.log('Calling AI service with user context:', { user });
      const aiResponse = await aiService.processQuery(aiInput, { user });
      console.log('AI Response received:', aiResponse);

      const assistantMessage = {
        role: 'assistant',
        content: aiResponse.response,
        type: aiResponse.type,
        timestamp: new Date()
      };

      setAiMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI processing error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble processing your request. Please try again.',
        type: 'error',
        timestamp: new Date()
      };
      setAiMessages(prev => [...prev, errorMessage]);
    }

    setAiInput('');
  };

  const isActive = (path) => location.pathname === path;

  // Listen for global AI assistant open event
  useEffect(() => {
    const handleGlobalAI = () => {
      setIsAIPanelOpen(true);
    };

    window.addEventListener('openAIAssistantFromApp', handleGlobalAI);

    return () => {
      window.removeEventListener('openAIAssistantFromApp', handleGlobalAI);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-4 sticky top-4 z-50">
      {/* Desktop Navbar */}
      <div className="hidden md:flex items-center justify-between bg-white/90 backdrop-blur-lg py-3 px-6 rounded-2xl border border-gray-200 shadow-xl">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-xl">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            MediCare 
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {menus.map((menu, index) => {
            const Icon = menu.icon;
            return (
              <Link
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive(menu.link)
                    ? "bg-blue-100 text-blue-700 shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                to={menu.link}
                key={index}
              >
                <Icon className="w-4 h-4" />
                {menu.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* AI Assistant Button */}
          <button
            onClick={() => {
              console.log('Opening AI Panel');
              setIsAIPanelOpen(!isAIPanelOpen);
            }}
            className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
          >
            <Bot className="w-5 h-5 text-white" />
          </button>

          {user ? (
            <div className="relative group">
              <button className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md">
                <User className="w-5 h-5 text-white" />
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-2xl rounded-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-top z-50 border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                </div>
                <ul className="flex flex-col py-2">
                  <li
                    onClick={() => { navigate("/profile"); setIsMenuOpen(false); }}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-3"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    My Profile
                  </li>
                  <li
                    onClick={() => { navigate("/my-appointments"); setIsMenuOpen(false); }}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-3"
                  >
                    <Calendar className="w-4 h-4 text-gray-500" />
                    My Appointments
                  </li>
                  {doctor && (
                    <li
                      onClick={() => { navigate("/doctor-dashboard"); setIsMenuOpen(false); }}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-3 text-blue-600"
                    >
                      <Stethoscope className="w-4 h-4" />
                      Doctor Dashboard
                    </li>
                  )}
                  <li
                    onClick={() => { navigate("/admin/login"); setIsMenuOpen(false); }}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-3 text-purple-600 border-t border-gray-100"
                  >
                    <Lock className="w-4 h-4" />
                    Admin Panel
                  </li>
                  <li
                    onClick={handleLogout}
                    className="px-4 py-3 hover:bg-red-50 cursor-pointer transition-colors flex items-center gap-3 text-red-500 border-t border-gray-100"
                  >
                    <X className="w-4 h-4" />
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white cursor-pointer py-2 px-6 hover:from-blue-700 hover:to-indigo-800 duration-300 transition-all rounded-xl shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden bg-white/90 backdrop-blur-lg py-3 px-4 rounded-2xl border border-gray-200 shadow-xl">
        <div className="flex items-center justify-between">
          <Link to={"/"} className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-1.5 rounded-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              MediCare
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Search className="w-4 h-4 text-gray-600" />
            </button>

            <button
              onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
              className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              <Bot className="w-4 h-4 text-white" />
            </button>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="mt-4 flex flex-col gap-1 bg-gray-50 rounded-xl p-2">
            {menus.map((menu, index) => {
              const Icon = menu.icon;
              return (
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  key={index}
                  to={menu.link}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive(menu.link)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {menu.name}
                </Link>
              );
            })}

            {user ? (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="px-4 py-2 text-sm text-gray-600">
                  <p className="font-medium">{user.name}</p>
                  <p className="capitalize">{user.role}</p>
                </div>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  to="/my-appointments"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Calendar className="w-4 h-4" />
                  Appointments
                </Link>
                {doctor && (
                  <Link
                    onClick={() => setIsMenuOpen(false)}
                    to="/doctor-dashboard"
                    className="flex items-center gap-3 px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Stethoscope className="w-4 h-4" />
                    Doctor Dashboard
                  </Link>
                )}
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  to="/admin/login"
                  className="flex items-center gap-3 px-4 py-3 text-purple-600 hover:bg-purple-50 rounded-lg"
                >
                  <Lock className="w-4 h-4" />
                  Admin Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <X className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { navigate("/login"); setIsMenuOpen(false); }}
                className="mt-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white w-full py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Search Doctors</h3>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name, specialty, or symptoms..."
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Assistant Panel */}
      {isAIPanelOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-end md:items-center md:justify-end p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] md:h-[700px] flex flex-col border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Medical AI Assistant</h3>
              </div>
              <button
                onClick={() => setIsAIPanelOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {aiMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <form onSubmit={(e) => { e.preventDefault(); handleAIMessage(); }} className="flex gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask me about doctors, appointments, or symptoms..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  <Bot className="w-5 h-5" />
                </button>
              </form>
              <div className="flex gap-2 mt-2 flex-wrap">
                {aiService.getSuggestedQuickActions().map((action, index) => (
                  <button
                    key={index}
                    onClick={() => setAiInput(action.query)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                  >
                    {action.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;