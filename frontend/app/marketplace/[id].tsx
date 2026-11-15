import React, { useCallback, useState } from 'react';
import { Alert, Clipboard, Linking, ScrollView, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, PackageX, Phone, PhoneCall, ShoppingBag } from 'lucide-react-native';

import ActionBar from '@/components/common/ActionBar';
import AppText from '@/components/common/AppText';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import ImageGallery from '@/components/common/ImageGallery';
import InfoRow from '@/components/common/InfoRow';
import LoadingState from '@/components/common/LoadingState';
import Screen from '@/components/common/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import Section from '@/components/common/Section';
import { layout } from '@/constants/theme';
import { useUser } from '@/hooks/useUser';
import { useQueryClient } from '@tanstack/react-query';

import { getCachedListItem } from '@/lib/cache';
import { queryKeys } from '@/lib/queryKeys';
import apiClient from '@/services/api';
import { refreshList } from '@/lib/queryClient';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { userId } = useUser();

  const queryClient = useQueryClient();
  // Open instantly with the item the list already downloaded.
  const [seed] = useState(() =>
    getCachedListItem(queryClient, queryKeys.marketplace, (p) => p._id === id),
  );
  const [product, setProduct] = useState<any>(seed ?? null);
  const [loading, setLoading] = useState(!seed);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await apiClient.get(`/api/marketplace/${id}`);
      setProduct(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchProduct();
    }, [fetchProduct]),
  );

  const handleContact = () => {
    if (product?.contactNumber) {
      Alert.alert('Seller Contact', `Phone Number: ${product.contactNumber}`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Copy Number',
          onPress: () => {
            Clipboard.setString(product.contactNumber);
            Alert.alert('Success', 'Copied to clipboard!');
          },
        },
        { text: 'Call Now', onPress: () => Linking.openURL(`tel:${product.contactNumber}`) },
      ]);
    }
  };

  const handleEdit = () => {
    router.push(`/marketplace/edit?id=${id}` as any);
  };

  const handleDelete = () => {
    Alert.alert('Delete Item', 'This action cannot be undone!', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiClient.delete(`/api/marketplace/${id}`);
            refreshList('marketplace');
            router.dismissTo('/marketplace');
          } catch {
            Alert.alert('Error', 'Failed to delete item.');
          }
        },
      },
    ]);
  };

  const header = <ScreenHeader title="Item details" />;

  if (loading) {
    return (
      <Screen header={header}>
        <LoadingState />
      </Screen>
    );
  }

  if (!product) {
    return (
      <Screen header={header}>
        <EmptyState
          icon={PackageX}
          title="Product not found"
          message="This listing may have been removed."
          actionLabel="Go back"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  const isOwner = product.seller === userId;

  return (
    <Screen
      header={header}
      bottomBar={
        <ActionBar>
          {isOwner ? (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button title="Edit details" variant="secondary" onPress={handleEdit} style={{ flex: 1 }} />
              <Button title="Remove" variant="danger" onPress={handleDelete} style={{ flex: 1 }} />
            </View>
          ) : (
            <Button title="Contact seller" icon={PhoneCall} onPress={handleContact} size="lg" />
          )}
        </ActionBar>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: layout.screenPadding, gap: 20, paddingBottom: 32 }}
      >
        <ImageGallery
          images={[product.image]}
          fallbackIcon={ShoppingBag}
          badge={<Badge label={product.condition || 'Item'} />}
        />

        <View style={{ gap: 10 }}>
          <Badge label="Available" tone="success" />
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <AppText variant="display" style={{ flex: 1 }}>
              {product.title}
            </AppText>
            <AppText variant="display" tone="primary">
              ${product.price}
            </AppText>
          </View>
        </View>

        <Card style={{ gap: 16 }}>
          <InfoRow icon={MapPin} label="Location" value={product.location} />
          <InfoRow icon={Phone} label="Contact" value={product.contactNumber} />
        </Card>

        <Section title="Description">
          <AppText variant="body" tone="secondary">
            {product.description}
          </AppText>
        </Section>
      </ScrollView>
    </Screen>
  );
}
