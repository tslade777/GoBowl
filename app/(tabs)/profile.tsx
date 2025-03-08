import { View, Text, Button, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import "../../global.css";
import { FIREBASE_AUTH, db } from '@/firebase.config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { router } from 'expo-router';
import { icons } from '@/constants';
import { checkIfImageExists, getLocalImagePath, handleImageSelection } from '../hooks/ImageFunctions';

const Profile = () => {
  const currentUser = FIREBASE_AUTH.currentUser;
  const storage = getStorage();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    age: "",
    bowlingHand: "",
    favoriteBall: "",
    yearsBowling: "",
    highGame: "",
    highSeries: "",
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [originalData, setOriginalData] = useState(userData);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      try {
        const userRef = doc(db, `users/${currentUser.uid}`);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            username: data.username || "N/A",
            email: data.email || "N/A",
            age: data.age ? data.age.toString() : "",
            bowlingHand: data.bowlingHand || "",
            favoriteBall: data.favoriteBall || "",
            yearsBowling: data.yearsBowling ? data.yearsBowling.toString() : "",
            highGame: data.highGame ? data.highGame.toString() : "",
            highSeries: data.highSeries ? data.highSeries.toString() : "",
          });
        }
        
        try {
          if( await checkIfImageExists(`${userData.username}.png`))
            setProfileImage(getLocalImagePath(`${userData.username}.png`))
          else {
            setProfileImage(null)
          }
        } catch (error) {
          console.log("No profile image found in Firebase Storage.");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    
  }, [currentUser]);

  const handleEditToggle = () => {
    setOriginalData(userData);
    setEditing(true);
  };
  
  const handleCancelEdit = () => {
    setUserData(originalData);
    setEditing(false);
  };

  const handleSaveChanges = async () => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, `users/${currentUser.uid}`);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const storedData = userDoc.data();
        const newData = {
          age: parseInt(userData.age) || 0,
          bowlingHand: userData.bowlingHand,
          favoriteBall: userData.favoriteBall,
          yearsBowling: parseInt(userData.yearsBowling) || 0,
          highGame: parseInt(userData.highGame) || 0,
          highSeries: parseInt(userData.highSeries) || 0,
        };
  
        const isSame = (Object.keys(newData) as Array<keyof typeof newData>).every(
          (key) => storedData[key] === newData[key]
        );
  
        if (isSame) {
          alert("No changes made.");
          setEditing(false);
          return;
        }
  
        await updateDoc(userRef, newData);
        setEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };
  

  const handleLogout = async () => {
    try {
      if (currentUser) {
        const userRef = doc(db, `users/${currentUser.uid}`);
        await updateDoc(userRef, { active: false });
      }
      console.log("User logged out successfully");
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  
  /**
   * 
   */
  const selectAndUploadImage = async () => {
    const result = await handleImageSelection(`profileImages/${currentUser?.uid}`, userData.username);
    if (result) {
      setLocalImage(result.localPath);
      setUploadedUrl(result.downloadURL);
      setProfileImage(result.localPath)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Profile</Text>
          </View>

          {editing ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleSaveChanges} style={styles.editButton}>
                <Text style={styles.editButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={handleEditToggle} style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.content}>
           <TouchableOpacity onPress={selectAndUploadImage} activeOpacity={0.7}>
            <Image source={profileImage ? { uri: profileImage } : icons.profile} style={styles.profileImage} />
          </TouchableOpacity>
          <Text style={styles.info}>Username: {userData.username}</Text>
          <Text style={styles.info}>Email: {userData.email}</Text>

          {editing ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Age"
                keyboardType="numeric"
                value={userData.age}
                onChangeText={(text) => setUserData({ ...userData, age: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Bowling Hand (Left, Right, Two Hands)"
                value={userData.bowlingHand}
                onChangeText={(text) => setUserData({ ...userData, bowlingHand: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Favorite Ball"
                value={userData.favoriteBall}
                onChangeText={(text) => setUserData({ ...userData, favoriteBall: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Years Bowling"
                keyboardType="numeric"
                value={userData.yearsBowling}
                onChangeText={(text) => setUserData({ ...userData, yearsBowling: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="High Game"
                keyboardType="numeric"
                value={userData.highGame}
                onChangeText={(text) => setUserData({ ...userData, highGame: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="High Series"
                keyboardType="numeric"
                value={userData.highSeries}
                onChangeText={(text) => setUserData({ ...userData, highSeries: text })}
              />
            </>
          ) : (
            <>
              <Text style={styles.info}>Age: {userData.age}</Text>
              <Text style={styles.info}>Bowling Hand: {userData.bowlingHand}</Text>
              <Text style={styles.info}>Favorite Ball: {userData.favoriteBall}</Text>
              <Text style={styles.info}>Years Bowling: {userData.yearsBowling}</Text>
              <Text style={styles.info}>High Game: {userData.highGame}</Text>
              <Text style={styles.info}>High Series: {userData.highSeries}</Text>
            </>
          )}

          <Button title="LOG OUT" onPress={handleLogout} color="#F24804" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginTop: 20,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    color: 'black',
    fontSize: 16,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '80%',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
  },
  profileImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    marginBottom: 10 },
});

export default Profile;
