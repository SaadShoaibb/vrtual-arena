import React from 'react';

const ExperienceCard = ({ experience, onBookNow, onViewPackages }) => {
  const {
    title,
    description,
    capacity,
    duration,
    age_requirement,
    single_player_price,
    pair_price,
    features = []
  } = experience;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header Image */}
      {experience.header_image_url && (
        <div className="h-48 bg-cover bg-center" 
             style={{ backgroundImage: `url(${experience.header_image_url})` }}>
        </div>
      )}
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        {/* Experience Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-lg mb-3">Experience Details</h4>
          
          {capacity && (
            <div className="mb-2">
              <span className="font-medium">Capacity:</span>
              <p className="text-gray-700">{capacity}</p>
            </div>
          )}
          
          {duration && (
            <div className="mb-2">
              <span className="font-medium">Duration:</span>
              <p className="text-gray-700">{duration}</p>
            </div>
          )}
          
          {age_requirement && (
            <div className="mb-2">
              <span className="font-medium">Age Requirement:</span>
              <p className="text-gray-700">{age_requirement}</p>
            </div>
          )}
        </div>

        {/* Features */}
        {features.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-gray-700">
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Pricing */}
        {(single_player_price || pair_price) && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-lg mb-3">Pricing</h4>
            
            {single_player_price && (
              <div className="mb-2">
                <span className="font-medium">Per Player:</span>
                <span className="text-2xl font-bold text-blue-600 ml-2">
                  ${parseFloat(single_player_price).toFixed(2)}
                </span>
              </div>
            )}
            
            {pair_price && (
              <div className="mb-2">
                <span className="font-medium">Pair ({capacity || '2 players'}):</span>
                <span className="text-2xl font-bold text-blue-600 ml-2">
                  ${parseFloat(pair_price).toFixed(2)}
                </span>
              </div>
            )}
            
            <p className="text-sm text-gray-600 mt-2">
              All-Inclusive Pricing - What you see is what you pay. No hidden fees or taxes added at checkout.
            </p>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onBookNow(experience)}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Book Now
          </button>
          <button
            onClick={() => onViewPackages(experience)}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            View Available Packages
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;