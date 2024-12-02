const FormInput = ({ label, error, icon: Icon, children }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="relative">
        {children}
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        )}
      </div>
      {error && (
        <p className="text-pink-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
