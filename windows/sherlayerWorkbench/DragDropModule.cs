using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ReactNative.Managed;
using System.Diagnostics;
using Windows.UI.Xaml;
using Windows.ApplicationModel.DataTransfer;
using Windows.UI.Core;
using Windows.Storage;
using Windows.Storage.Streams;
using Windows.Data.Json;

namespace DragAndDrop
{
    [ReactModule]
    class DragDropModule
    {
        [ReactMethod("init")]
        public async void Init()
        {
            Debug.WriteLine("Running init");

            var dispatcher = Windows.ApplicationModel.Core.CoreApplication.MainView.CoreWindow.Dispatcher;
            if (dispatcher != null)
            {
                await dispatcher.RunAsync(CoreDispatcherPriority.Normal,
                    () =>
                    {
                        var currentWindow = Window.Current;
                        if (currentWindow != null)
                        {
                            var currentContent = currentWindow.Content;
                            if (currentContent != null)
                            {
                                Window.Current.Content.AllowDrop = true;
                                Window.Current.Content.DragOver += Content_DragOver;
                                Window.Current.Content.DragLeave += Content_DragLeave;
                                Window.Current.Content.Drop += Content_Drop;
                            }
                            else
                            {
                                Debug.WriteLine("content is null");
                            }
                        }
                        else
                        {
                            Debug.WriteLine("window is null");
                        }
                    });
            } else
            {
                Debug.WriteLine("dispatcher is null");
            }
        }

        [ReactEvent]
        public Action<string> DragOverEvent { get; set; }

        private void Content_DragOver(object sender, DragEventArgs e)
        {
            e.AcceptedOperation = DataPackageOperation.Copy;
            Debug.WriteLine("DragOver");
            DragOverEvent("DragOver");
        }

        [ReactEvent]
        public Action<string> DragLeaveEvent { get; set; }

        private void Content_DragLeave(object sender, DragEventArgs e)
        {
            Debug.WriteLine("DragLeave");
            DragLeaveEvent("DragLeave");
        }

        [ReactEvent]
        public Action<string> DropEvent { get; set; }

        public async Task<string> GetFileContentAsBase64Async(StorageFile storageFile)
        {
            try
            {
                Stream stream = await storageFile.OpenStreamForReadAsync();
                using (var memoryStream = new MemoryStream())
                {
                    stream.CopyTo(memoryStream);
                    byte[] fileBytes = memoryStream.ToArray();
                    string base64String = Convert.ToBase64String(fileBytes);
                    return base64String;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error converting file to Base64: " + ex.Message);
                return null;
            }
        }

        private async void Content_Drop(object sender, DragEventArgs e)
        {
            Debug.WriteLine("Drop");
            if (e.DataView.Contains(StandardDataFormats.StorageItems))
            {
                var items = await e.DataView.GetStorageItemsAsync();
                if (items.Count > 0)
                {
                    var droppedFiles = new JsonObject();
                    foreach (var droppedFile in items.OfType<StorageFile>())
                    {
                        var fileObject = new JsonObject();

                        var filename = droppedFile.Name;

                        var fileExtension = Path.GetExtension(filename)?.ToLowerInvariant();
                        fileExtension = fileExtension.Substring(1);

                        string fileContent = null;

                        if (fileExtension == "txt")
                        {
                            fileContent = await FileIO.ReadTextAsync(droppedFile);
                        }
                        else
                        {
                            // File
                            fileContent = await GetFileContentAsBase64Async(droppedFile);
                        }

                        if (fileContent != null)
                        {
                            fileObject.Add("filename", JsonValue.CreateStringValue(filename));
                            fileObject.Add("fileExtension", JsonValue.CreateStringValue(fileExtension));
                            fileObject.Add("fileContent", JsonValue.CreateStringValue(fileContent));

                            droppedFiles.Add(filename, fileObject);
                        }
                    }

                    var serializedFiles = droppedFiles.Stringify();
                    DropEvent(serializedFiles);
                }
            }
        }
    }
}
