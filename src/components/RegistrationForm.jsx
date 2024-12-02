import { motion } from 'framer-motion';
import { User, Briefcase, Phone, Hash, Sparkles } from 'lucide-react';
import FormInput from './FormInput';

const RegistrationForm = ({
  formData,
  errors,
  isLoading,
  registrationNumber,
  todayEvents,
  handleChange,
  handleSubmit,
  handleViewRegistrations
}) => {
  const departments = [
    "Arabic", "B.Voc Auto", "B.Voc IT", "BCom CA", "BMMC", "Botany",
    "Chemistry", "Commerce", "Computer Science", "Economics",
    "English (Aided)", "English (SF)", "Functional English", "Geology",
    "History", "Library Science", "Malayalam", "Management Studies",
    "Maths", "MCJ", "Physics", "Psychology (Aided)", "Psychology (SF)",
    "Sociology", "Statistics", "Zoology"
  ];

  const years = ["UG 1st Year", "UG 2nd Year", "UG 3rd Year", "PG 1st Year", "PG 2nd Year"];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput label="Event" error={errors.event}>
        <select
          value={formData.event}
          onChange={(e) => handleChange('event', e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
        >
          <option value="" className="bg-gray-900">Select Event</option>
          {todayEvents.map((item, index) => (
            <option key={index} value={item.event} className="bg-gray-900">
              {item.event}
            </option>
          ))}
        </select>
      </FormInput>

      <FormInput label="Name" error={errors.name} icon={User}>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
          placeholder="Enter your full name"
        />
      </FormInput>

      <FormInput label="Department" error={errors.department} icon={Briefcase}>
        <select
          value={formData.department}
          onChange={(e) => handleChange('department', e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
        >
          <option value="" className="bg-gray-900">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept} className="bg-gray-900">{dept}</option>
          ))}
        </select>
      </FormInput>

      <FormInput label="Year" error={errors.year}>
        <select
          value={formData.year}
          onChange={(e) => handleChange('year', e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
        >
          <option value="" className="bg-gray-900">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year} className="bg-gray-900">{year}</option>
          ))}
        </select>
      </FormInput>

      <FormInput label="Roll Number" error={errors.rollNo} icon={Hash}>
        <input
          type="text"
          value={formData.rollNo}
          onChange={(e) => handleChange('rollNo', e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
          placeholder="Enter your roll number"
        />
      </FormInput>

      <FormInput label="Phone Number" error={errors.phone} icon={Phone}>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
          placeholder="Enter your phone number"
        />
      </FormInput>

      <motion.button
        type="submit"
        className="w-full bg-gradient-to-r from-pink-500 to-violet-500 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
        disabled={isLoading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          </div>
        ) : (
          "Register Now"
        )}
      </motion.button>

      {registrationNumber && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 text-emerald-400 font-medium mb-1">
            <Sparkles className="w-5 h-5" />
            <span>Registration Successful!</span>
          </div>
          <p className="text-white">
            Your Registration Number: <span className="font-mono font-bold">{registrationNumber}</span>
          </p>
        </motion.div>
      )}

      <motion.button
        type="button"
        onClick={handleViewRegistrations}
        className="w-full mt-4 bg-white/5 border border-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        View Registered Participants
      </motion.button>
    </form>
  );
};

export default RegistrationForm;
