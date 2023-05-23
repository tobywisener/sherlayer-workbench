import React, { useEffect, useState } from "react";
import { View, Image, Text } from "react-native";
//import RNFS from 'react-native-fs';

const RenderFileView = (selectedFile) => {

  const fileExtension = selectedFile["selectedFile"]["fileExtension"];

  const base64Image = selectedFile["selectedFile"]["fileContent"];
  if (
    fileExtension === "png" ||
    fileExtension === "jpg" ||
    fileExtension === "jpeg"
  ) {
    return (
      <View style={{ padding: 20 }}>
        <Image
          resizeMode="cover"
          source={{ uri: `data:image;base64,${base64Image}` }}
          style={{ width: "100%", aspectRatio: 1 }}
        />
      </View>
    );
  } else {
    return (
      <View style={{ padding: 20 }}>
        <Text
          style={{
            color: "black",
            fontFamily: "Cascadia Code, Consolas",
            fontSize: 24,
          }}
        >
          {selectedFile["selectedFile"]["fileContent"]}
        </Text>
      </View>
    );
  }
};

export default RenderFileView;
