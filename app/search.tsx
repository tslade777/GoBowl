import { View, Text, TextInput, Button, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import "../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase.config';

const Search = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<{ id: string; username: string; email: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as { id: string; username: string; email: string }[];
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <SafeAreaView className='bg-primary h-full p-4'>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ backgroundColor: '#F24804', padding: 8, borderRadius: 5 }}>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>Back</Text>
        </TouchableOpacity>
        <Text className='text-3xl text-center text-white flex-1'>Search Users</Text>
      </View>
      <TextInput
        className='bg-white p-2 rounded mb-4'
        placeholder='Enter username...'
        value={search}
        onChangeText={setSearch}
      />
      <Button title='Search' onPress={() => console.log("Searching for", search)} color='#007BFF' />
      {loading ? (
        <ActivityIndicator size='large' color='#007BFF' style={{ marginTop: 10 }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: '#333', padding: 10, margin: 5, borderRadius: 5 }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{item.username}</Text>
              <Text style={{ color: 'gray' }}>{item.email}</Text>
              <TouchableOpacity style={{ backgroundColor: '#007BFF', padding: 5, borderRadius: 5, marginTop: 5 }}>
                <Text style={{ color: 'white', textAlign: 'center' }}>Add Friend</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Search;
