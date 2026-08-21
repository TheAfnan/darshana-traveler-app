import { Star, MapPin } from 'lucide-react';


interface Guide {
  _id: string;
  name: string;
  location: string;
  rating: number;
  profileImage: string;
}

interface GuideCardProps {
  guide: Guide;
  onClick?: () => void;
}


const GuideCard = ({ guide, onClick }: GuideCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
    >
      <img
        src={guide.profileImage || 'https://via.placeholder.com/150'}
        alt={guide.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{guide.name}</h3>
        <div className="flex items-center gap-2 mb-2 text-gray-700">
          <MapPin size={18} className="text-red-500" />
          <span className="text-sm">{guide.location}</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Star size={18} className="text-yellow-500 fill-yellow-500" />
          <span className="ml-1 font-semibold text-gray-900">{guide.rating.toFixed(1)}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Contact Guide
        </button>
      </div>
    </div>
  );
};

export default GuideCard;
