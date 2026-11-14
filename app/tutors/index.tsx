import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { GraduationCap } from 'lucide-react-native';

import FeedScreen from '@/components/common/FeedScreen';
import LoginRequiredModal from '@/components/feedback/LoginRequiredModal';
import TutorCard from '@/features/tutors/components/TutorCard';
import { useTutors } from '@/features/tutors/hooks/useTutors';
import { useUser } from '@/hooks/useUser';

const FILTERS = ['ALL', 'ONLINE', 'OFFLINE', 'MATH', 'SCIENCE', 'IT'] as const;
type TutorFilter = (typeof FILTERS)[number];

export default function FindTutor() {
  const router = useRouter();
  const { tutorList, loading, refreshTutors } = useTutors();
  const { userId } = useUser();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<TutorFilter>('ALL');
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const filteredTutors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tutorList.filter((tutor) => {
      const matchesSearch =
        !query || tutor.name?.toLowerCase().includes(query) || tutor.subject?.toLowerCase().includes(query);

      let matchesFilter = true;
      if (selectedFilter === 'ONLINE') matchesFilter = tutor.isOnline !== false;
      else if (selectedFilter === 'OFFLINE') matchesFilter = tutor.isOnline === false;
      else if (selectedFilter !== 'ALL') matchesFilter = !!tutor.subject?.toUpperCase().includes(selectedFilter);

      return matchesSearch && matchesFilter;
    });
  }, [tutorList, searchQuery, selectedFilter]);

  const handlePressTutor = (tutor: any) => {
    if (!userId) {
      setLoginModalVisible(true);
      return;
    }

    if (tutor.userId === userId || tutor._id === userId) {
      router.push('/tutors/setup' as any);
      return;
    }

    router.push(`/tutors/${tutor._id}` as any);
  };

  const handleCreateTutor = () => {
    if (!userId) {
      setLoginModalVisible(true);
      return;
    }

    router.push('/tutors/setup' as any);
  };

  return (
    <FeedScreen
      title="Find Tutors"
      subtitle="Connect with skilled tutors across your campus."
      search={{ value: searchQuery, onChange: setSearchQuery, placeholder: 'Search tutors or subjects...' }}
      filters={{ options: FILTERS, selected: selectedFilter, onSelect: setSelectedFilter }}
      data={filteredTutors}
      keyExtractor={(tutor) => tutor._id}
      renderItem={({ item }) => <TutorCard tutor={item} onPress={() => handlePressTutor(item)} />}
      loading={loading}
      empty={{ icon: GraduationCap, title: 'No tutors found', message: 'Try a different subject or filter.' }}
      onCreate={handleCreateTutor}
      createLabel="Become a tutor"
      onRefresh={refreshTutors}
    >
      <LoginRequiredModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        icon={GraduationCap}
        message="Please sign in to your UniSphere account to view tutor details or create your tutor profile."
      />
    </FeedScreen>
  );
}
