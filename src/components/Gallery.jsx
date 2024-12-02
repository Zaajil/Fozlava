import React, { useState, useEffect } from 'react';

const API_KEY = 'AIzaSyBggHp5J9hpNnY-pEMimntIOUe_h1oTdnU'; // Your Google API Key
const FOLDER_ID = '1vFCXPHuIu1mojq7jdxr5h5pxMM1DvyCF'; // Your Google Drive Folder ID

const Gallery = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchPhotosFromDrive();
  }, []);

  // Fetch photos from Google Drive
  const fetchPhotosFromDrive = async () => {
    try {
      console.log('Fetching photos from Google Drive...');
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}' in parents and mimeType contains 'image/'&key=${API_KEY}&fields=files(id,name)`
      );
    
      console.log('API response status:', response.status); // Log API response status
      
      if (response.ok) {
        const data = await response.json();
        console.log('API response data:', data);
    
        // Map the response to get the image URLs
        const photos = data.files.map(file => {
          // Convert the shareable link to direct image URL
          const url = `https://drive.google.com/uc?export=view&id=${file.id}`;
          console.log(`Generated image URL: ${url}`);
          return {
            id: file.id,
            name: file.name,
            url: url,
          };
        });
        
        setPhotos(photos);
      } else {
        console.error('Error fetching photos:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  return (
    <div className="pt-16 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mt-10">Event Gallery</h2>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto p-4">
        {photos.length === 0 ? (
          <div>No photos found</div>
        ) : (
          photos.map((photo, index) => (
            <div key={index} className="relative w-full">
              <img
                src={photo.url}
                alt={`Uploaded on ${photo.name}`} // Alt tag for accessibility
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                className="rounded shadow-md"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Gallery;
