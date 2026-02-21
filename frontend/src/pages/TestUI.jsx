import { Link } from "react-router-dom";

const TestUI = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          UI Test Page
        </h1>
        
        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover-card">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Card 1</h2>
            <p className="text-gray-600">This should have proper shadows and hover effects</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-3">Gradient Card</h2>
            <p>This should have a blue gradient background</p>
          </div>
          
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-300 transition-colors">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Border Card</h2>
            <p>This should have bordered styling with hover effects</p>
          </div>
        </div>
        
        {/* Test Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors btn-hover">
            Primary Button
          </button>
          
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg">
            Gradient Button
          </button>
          
          <button className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:border-gray-400 transition-colors">
            Outline Button
          </button>
        </div>
        
        {/* Test Typography */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Typography Test</h2>
          <p className="text-gray-600 mb-2">Regular paragraph text</p>
          <p className="text-lg font-medium text-gray-800 mb-2">Medium bold text</p>
          <p className="text-sm text-gray-500">Small muted text</p>
        </div>
        
        {/* Test Form Elements */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Form Elements</h2>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Text input with focus effects"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 input-focus"
            />
            <textarea 
              placeholder="Textarea with focus effects"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 input-focus min-h-[100px]"
            />
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link 
            to="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestUI;