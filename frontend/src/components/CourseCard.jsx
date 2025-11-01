import { Link } from 'react-router-dom';
import { Star, Clock, Users, BookOpen, Video } from 'lucide-react';

const CourseCard = ({ course, showProgress = false, progress = 0 }) => {
  const {
    _id,
    title,
    description,
    thumbnail,
    instructor,
    price,
    rating,
    enrollmentCount,
    duration,
    lessons
  } = course;

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h` : `${minutes}m`;
  };

  return (
    <Link
      to={`/courses/${_id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.03] border border-gray-100"
    >
      {/* Thumbnail - 16:9 aspect ratio */}
      <div className="relative aspect-video overflow-hidden bg-gray-200">
        <img
          src={thumbnail || 'https://via.placeholder.com/640x360?text=Course+Thumbnail'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {price === 0 && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Free
          </div>
        )}
        {price > 0 && (
          <div className="absolute top-3 right-3 bg-primary-700 text-white px-3 py-1 rounded-full text-xs font-semibold">
            ${price}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-primary-700 transition-colors">
          {title}
        </h3>

        {/* Instructor */}
        <p className="text-sm text-gray-600">
          by <span className="font-medium text-gray-800">{instructor?.name || 'Instructor'}</span>
        </p>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
          <div className="flex items-center space-x-4">
            {/* Rating */}
            {rating?.average > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="font-semibold text-gray-700">
                  {rating.average.toFixed(1)}
                </span>
                <span className="text-gray-400">({rating.count})</span>
              </div>
            )}

            {/* Enrollment Count */}
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{enrollmentCount || 0}</span>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(duration || 0)}</span>
          </div>
        </div>

        {/* Lessons & Videos Count */}
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4" />
            <span>{lessons?.length || 0} lessons</span>
          </div>
          {lessons && lessons.length > 0 && (
            <div className="flex items-center space-x-1 text-blue-600">
              <Video className="h-4 w-4" />
              <span>{lessons.filter(l => l.videoUrl).length} videos</span>
            </div>
          )}
        </div>

        {/* Progress Bar (if applicable) */}
        {showProgress && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary-600 h-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CourseCard;
