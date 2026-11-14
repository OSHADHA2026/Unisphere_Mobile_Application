import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Users } from 'lucide-react-native';

import FeedScreen from '@/components/common/FeedScreen';
import LoginRequiredModal from '@/components/feedback/LoginRequiredModal';
import StudyGroupCard from '@/features/studyGroup/components/StudyGroupCard';
import { useStudyGroups } from '@/features/studyGroup/hooks/useStudyGroups';
import { useUser } from '@/hooks/useUser';

const FILTERS = ['ALL', 'GENERAL', 'MATHEMATICS', 'COMPUTER SCIENCE'] as const;
type StudyFilter = (typeof FILTERS)[number];

export default function StudyGroupFeed() {
  const router = useRouter();
  const { userId } = useUser();
  const { groups, loading, refreshGroups } = useStudyGroups();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<StudyFilter>('ALL');
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return groups.filter((group) => {
      const matchesSearch =
        !query ||
        group.subject?.toLowerCase().includes(query) ||
        group.location?.toLowerCase().includes(query) ||
        group.tag?.toLowerCase().includes(query);

      const matchesFilter = selectedFilter === 'ALL' || group.tag?.toUpperCase() === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [groups, searchQuery, selectedFilter]);

  const handlePressGroup = (id: string) => {
    if (!userId) {
      setLoginModalVisible(true);
      return;
    }

    router.push(`/studyGroup/${id}` as any);
  };

  const handleCreateGroup = () => {
    if (!userId) {
      setLoginModalVisible(true);
      return;
    }

    router.push('/studyGroup/create' as any);
  };

  return (
    <FeedScreen
      title="Study Groups"
      subtitle="Connect with peers and master your courses together."
      search={{ value: searchQuery, onChange: setSearchQuery, placeholder: 'Find study groups...' }}
      filters={{ options: FILTERS, selected: selectedFilter, onSelect: setSelectedFilter }}
      data={filteredGroups}
      keyExtractor={(group) => group._id || group.id}
      renderItem={({ item }) => (
        <StudyGroupCard group={item} onPress={() => handlePressGroup(item._id || item.id)} />
      )}
      loading={loading}
      empty={{ icon: Users, title: 'No study groups found', message: 'Try adjusting your search or filter.' }}
      onCreate={handleCreateGroup}
      createLabel="Create study group"
      onRefresh={refreshGroups}
    >
      <LoginRequiredModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        message="Please sign in to view study group details or create a new study group."
      />
    </FeedScreen>
  );
}
