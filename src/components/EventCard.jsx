import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';

const EventCard = ({ event, index }) => {
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
    >
      <h3 className="text-xl font-bold text-white mb-3">{event.event}</h3>
      <div className="space-y-2 text-gray-300">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-pink-400" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-violet-400" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-400" />
          <span>{event.venue}</span>
        </div>
      </div>
    </motion.li>
  );
};

export default EventCard;
