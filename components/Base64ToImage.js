import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
//import RNFS from 'react-native-fs';

const Base64ToImage = (selectedFile) => {
    const [imagePath, setImagePath] = useState('');

    useEffect(() => {
        const base64Image = selectedFile['selectedFile']['fileContent'];
        //var newImagePath = RNFS.DocumentDirectoryPath + selectedFile['selectedFile']['filename'];
        var newImagePath = 'C:\\Users\\vmishchenko\\Documents\\sherlayer-workbench\\windows\\sherlayerWorkbench\\Assets\\' + selectedFile['selectedFile']['filename'];
        console.log(base64Image);
        console.log(newImagePath);

        RNFS.writeFile(newImagePath, base64Image, 'base64')
          .then(() => {
              console.log('Image converted successfully');
              setImagePath(newImagePath);
          })
          .catch(error => {
              console.log('Error converting image:', error);
          });
    }, []);

    console.log(imagePath);

    return (
      <View>
          {imagePath !== '' && (
            <Image source={{ uri: imagePath }} style={{ width: 200, height: 200 }} />
          )}
      </View>
    );
};

export default Base64ToImage;
