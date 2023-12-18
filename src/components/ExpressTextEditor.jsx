// the dialog solution all depercated due to the difficulty
// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TextInput,
//   KeyboardAvoidingView,
//   findNodeHandle,
//   Keyboard as KeyboardRN,
//   KeyboardEvent,
//   TouchableOpacity,
//   ScrollView,
//   Platform,
// } from "react-native";
// import Svg, { Mask, Path, G } from "react-native-svg";
// import { Button, Constants, Dialog, Keyboard, Incubator } from "react-native-ui-lib"; // eslint-disable-line

// const windowWidth = Dimensions.get("window").width;
// const windowHeight = Dimensions.get("window").height;
// const KeyboardTrackingView = Keyboard.KeyboardTrackingView;
// export default function ExpressTextEditor(props) {
//   const item = props.item;
//   const createExpress = props.createExpress;
//   // for dialog layout variables
//   const height08 = Dimensions.get("window").height * 0.8;
//   const getDialogKey = height => {
//     return `dialog-key-${"bottom"}-${height}`;
//   };

//   const supportedOrientations = ["portrait", "landscape"];
//   //Dialog show with parent props connected
//   const [isShowDialog, setIsShowDialog] = useState(false);
//   const textInputRef = useRef();
//   useEffect(() => {
//     setIsShowDialog(props.isShowDialog);
//   }, [props.isShowDialog]);
//   const hideDialog = () => {
//     setIsShowDialog(false);
//     props.setIsShowDialog(false);
//   };
//   const [textValue, setTextValue] = useState("");
//   //keyboard height
//   const [keyboardHeight, setKeyboardHeight] = useState(0);
//   const [isKeyboardShow, setIsKeyboardShow] = useState(false);
//   useEffect(() => {
//     function onKeyboardDidShow(e) {
//       setKeyboardHeight(e.endCoordinates.height);
//       setIsKeyboardShow(true);
//     }
//     function onKeyboardDidHide() {
//       setKeyboardHeight(0);
//       setIsKeyboardShow(false);
//     }
//     const showSubscription = KeyboardRN.addListener("keyboardDidShow", onKeyboardDidShow);
//     const hideSubscription = KeyboardRN.addListener("keyboardDidHide", onKeyboardDidHide);
//     return () => {
//       showSubscription.remove();
//       hideSubscription.remove();
//     };
//   }, []);
//   //keyboardTrackingView
//   const renderKeyboardTrackingView = () => {
//     return (
//       <View
//         style={{
//           width: "100%",
//           height: 62,
//           flexDirection: "column",
//           zIndex: 6,
//         }}
//       >
//         <Text
//           style={{
//             alignSelf: "flex-end",
//             marginRight: 20,
//             fontSize: 15,
//           }}
//         >
//           {textValue.length}/250
//           {/* isKeyboardShow{isKeyboardShow.toString()} Platform.OS === "web"{" "}
//           {(Platform.OS === "web").toString()} */}
//         </Text>
//         <View
//           style={{
//             width: "100%",
//             flex: 1,
//             flexDirection: "row",
//             alignSelf: "center",
//           }}
//         >
//           <TouchableOpacity style={{ marginLeft: 10, alignSelf: "center" }}>
//             <Add_photo_svg style={{ width: 35, height: 35 }} />
//           </TouchableOpacity>
//           <TouchableOpacity style={{ marginLeft: 3, alignSelf: "center" }}>
//             <Add_audio_svg style={{ width: 35, height: 35 }} />
//           </TouchableOpacity>
//           <View style={{ flex: 1 }} />
//           <TouchableOpacity
//             style={{
//               height: 32,
//               width: 80,
//               backgroundColor: textValue.length == 0 ? "gainsboro" : "black",
//               alignSelf: "center",
//               marginRight: 10,
//               borderRadius: 5,
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//             onPress={onWander}
//             disabled={textValue.length == 0}
//           >
//             <Text style={{ color: "white", fontSize: 15, fontWeight: 600 }}>Wander</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };
//   const onWander = () => {
//     console.log("===onWander, textValue:", textValue);
//     hideDialog();
//     createExpress(item, textValue);
//   };
//   //dialog content
//   const renderDialogContent = () => {
//     return (
//       <View
//         style={{
//           height: height08,
//           width: windowWidth,
//           backgroundColor: "white",
//           zIndex: 5,
//           alignSelf: "center",
//           borderTopRightRadius: 15,
//           borderTopLeftRadius: 15,
//           flexDirection: "column",
//         }}
//       >
//         <Text
//           style={{
//             fontSize: 23,
//             marginTop: 30,
//             marginBottom: 20,
//             marginHorizontal: 20,
//             fontWeight: 700,
//           }}
//         >
//           {item.express_question}
//         </Text>

//         <View style={{ flex: 1, paddingBottom: keyboardHeight }}>
//           <ScrollView
//             keyboardShouldPersistTaps="handled"
//             keyboardDismissMode="on-drag"
//             style={{
//               flexDirection: "column",
//             }}
//           >
//             {textValue.length == 0 ? (
//               <View>
//                 <Text
//                   style={{
//                     fontSize: 16,
//                     marginVertical: 0,
//                     marginHorizontal: 20,
//                     fontWeight: 700,
//                     color: "gray",
//                   }}
//                 >
//                   Express, whatever comes to your mind,{" "}
//                 </Text>
//                 <Text
//                   style={{
//                     fontSize: 16,
//                     marginVertical: 12,
//                     marginHorizontal: 20,
//                     fontWeight: 300,
//                     color: "gray",
//                   }}
//                 >
//                   and connect with like-minded wanderers!
//                 </Text>
//               </View>
//             ) : (
//               <></>
//             )}
//             <TextInput
//               autoFocus={true}
//               editable
//               multiline
//               maxLength={250}
//               numberOfLines={100}
//               onChangeText={text => setTextValue(text)}
//               value={textValue}
//               style={{
//                 width: windowWidth - 40,
//                 height: 150,
//                 fontSize: 16,
//                 marginVertical: 12,
//                 marginHorizontal: 20,
//                 color: "black",
//                 alignSelf: "flex-start",
//               }}
//               ref={textInputRef}
//             />
//           </ScrollView>
//         </View>
//         {Platform.OS === "web" ? (
//           renderKeyboardTrackingView()
//         ) : (
//           <KeyboardTrackingView trackInteractive useSafeArea>
//             {renderKeyboardTrackingView()}
//           </KeyboardTrackingView>
//         )}
//       </View>
//     );
//   };
//   return (
//     <>
//       <Dialog
//         key={getDialogKey(height08)}
//         top={false}
//         bottom={true}
//         height={height08}
//         panDirection={Dialog.directions.DOWN}
//         containerStyle={{ overflow: "visible" }}
//         visible={isShowDialog}
//         onDismiss={hideDialog}
//         supportedOrientations={supportedOrientations}
//         ignoreBackgroundPress={false}
//       >
//         {renderDialogContent()}
//       </Dialog>
//     </>
//   );
// }

// const Add_photo_svg = props => {
//   return (
//     <View {...props}>
//       <Svg viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <Mask
//           id="a"
//           style={{
//             maskType: "alpha",
//           }}
//           maskUnits="userSpaceOnUse"
//           x={0}
//           y={0}
//           {...props}
//         >
//           <Path fill="#D9D9D9" d="M0 0.5H24V24.5H0z" />
//         </Mask>
//         <G mask="url(#a)">
//           <Path
//             d="M5 21.5c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 013 19.5v-14c0-.55.196-1.02.587-1.412A1.926 1.926 0 015 3.5h9v2H5v14h14v-9h2v9c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0119 21.5H5zm12-12v-2h-2v-2h2v-2h2v2h2v2h-2v2h-2zm-11 8h12l-3.75-5-3 4-2.25-3-3 4z"
//             fill="#575757"
//           />
//         </G>
//       </Svg>
//     </View>
//   );
// };

// const Add_audio_svg = props => {
//   return (
//     <View {...props}>
//       <Svg viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <Mask
//           id="a"
//           style={{
//             maskType: "alpha",
//           }}
//           maskUnits="userSpaceOnUse"
//           x={0}
//           y={0}
//         >
//           <Path fill="#D9D9D9" d="M0 0.5H24V24.5H0z" />
//         </Mask>
//         <G mask="url(#a)">
//           <Path
//             d="M7 18.5v-12h2v12H7zm4 4v-20h2v20h-2zm-8-8v-4h2v4H3zm12 4v-12h2v12h-2zm4-4v-4h2v4h-2z"
//             fill="#575757"
//           />
//         </G>
//       </Svg>
//     </View>
//   );
// };
