import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableHighlight,
  NativeModules,
  NativeEventEmitter,
} from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";

import RenderFileView from './components/RenderFileView';


const App = () => {

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [files, setFiles] = useState({});
  const [selectedFilename, setSelectedFilename] = useState(null);

  useEffect(() => {
    (async () => {
      await NativeModules.DragDropModule.init();
      const listener = new NativeEventEmitter();

      listener.addListener(
        "DragOverEvent",
        () => {
          setIsDraggingOver(true);
        },
        this,
      );

      listener.addListener(
        "DragLeaveEvent",
        () => {
          setIsDraggingOver(false);
        },
        this,
      );

      listener.addListener("DropEvent", e => {
        const droppedFiles = JSON.parse(e);
        setFiles(droppedFiles);
        setSelectedFilename(null);
      });
    })();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollViewContentContainer,
            isDraggingOver && styles.onDrag,
          ]}>
          {Object.keys(files).length === 0 && (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 28 }}>
                {isDraggingOver
                  ? "Drop the files to view"
                  : "Drop text files here to view them"}
              </Text>
            </View>
          )}
          {Object.keys(files).length > 0 && (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: Colors.dark,
              }}>
              <View style={{ width: 320 }}>
                <Text style={{ fontSize: 32, fontWeight: "bold" }}>
                  Dropped Files
                </Text>
                {
                  Object.keys(files).map(filename => {
                      return (
                        <TouchableHighlight
                          key={filename}
                          onPress={() => setSelectedFilename(filename)}>
                          <Text style={{ color: "black", fontSize: 24 }}>
                            {filename}
                          </Text>
                        </TouchableHighlight>
                      );
                    },
                  )}
              </View>
              <View
                style={{ flex: 1, backgroundColor: Colors.light, padding: 8 }}>
                {selectedFilename && (
                  <ScrollView>
                    <RenderFileView selectedFile={files[selectedFilename]} />
                  </ScrollView>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  emptyState: {},
  onDrag: { backgroundColor: "#0078d4" },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    backgroundColor: Colors.dark,
    height: "100%",
  },
});

export default App;
