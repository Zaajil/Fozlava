import React from 'react';

const Gallery = () => {
  const photos = [
    '/images/photo1.jpg',
    '/images/photo2.jpg',
    '/images/photo3.jpg',
  ];

  return (
    <div className="pt-16 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mt-10">Event Gallery</h2>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto p-4">
        {photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Event ${index + 1}`}
            className="w-full h-60 object-cover rounded shadow"
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
