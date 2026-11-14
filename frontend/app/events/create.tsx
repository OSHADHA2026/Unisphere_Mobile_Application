import React, { useState } from "react";
import { Alert, Platform, Pressable, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Calendar as CalendarIcon, Clock, MapPin, Plus, X } from "lucide-react-native";

import AppText from "@/components/common/AppText";
import FormScreen from "@/components/common/FormScreen";
import PhotoPicker from "@/components/common/PhotoPicker";
import TextField from "@/components/common/TextField";
import SuccessModal from "@/components/feedback/SuccessModal";
import { useTheme } from "@/context/ThemeContext";
import DatePickerModal from "@/features/events/components/DatePickerModal";
import TimePickerModal from "@/features/events/components/TimePickerModal";
import apiClient from "@/services/api";

/** Small tappable icon placed inside a TextField (calendar / clock). */
const FieldIcon = ({ icon: IconComponent, onPress, label }: { icon: any; onPress: () => void; label: string }) => {
  const { colors } = useTheme();

  return (
    <Pressable accessibilityLabel={label} onPress={onPress} hitSlop={10}>
      <IconComponent size={20} color={colors.primary} />
    </Pressable>
  );
};

export default function CreateEvent() {
  const router = useRouter();
  const { editId } = useLocalSearchParams();
  const { colors } = useTheme();
  const isEditing = !!editId;
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(["Limited Seats", "Certificate Provided"]);
  const [image, setImage] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    description: "",
    tags: tags,
  });
  const [errors, setErrors] = useState<any>({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarField, setCalendarField] = useState<"startDate" | "endDate">(
    "startDate",
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeField, setTimeField] = useState<"startTime" | "endTime">(
    "startTime",
  );

  const openCalendar = (field: "startDate" | "endDate") => {
    setCalendarField(field);
    setShowCalendar(true);
  };

  const openTimePicker = (field: "startTime" | "endTime") => {
    setTimeField(field);
    setShowTimePicker(true);
  };

  const handleSelectDate = (date: Date) => {
    const formatted = `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}/${date.getFullYear()}`;
    updateForm(calendarField, formatted);
    setShowCalendar(false);
  };

  const handleSelectTime = (time: string) => {
    updateForm(timeField, time);
    setShowTimePicker(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  const removeTag = (index: number) =>
    setTags(tags.filter((_, i) => i !== index));

  const pickImage = async () => {
    try {
      setIsPicking(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
        base64: true,
      });
      if (!result.canceled && result.assets[0].base64)
        setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    } catch {
      Alert.alert("Error", "Could not pick image");
    } finally {
      setIsPicking(false);
    }
  };

  React.useEffect(() => {
    if (isEditing)
      (async () => {
        try {
          const {
            data: { success, event: ev },
          } = await apiClient.get(`/events/${editId}`);
          if (success) {
            const sDate = new Date(ev.startDate),
              eDate = new Date(ev.endDate);
            setForm({
              title: ev.title,
              startDate: sDate.toLocaleDateString(),
              startTime: sDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
              endDate: eDate.toLocaleDateString(),
              endTime: eDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
              location: ev.location,
              description: ev.description,
              tags: ev.tags,
            });
            setTags(ev.tags);
            if (ev.image) setImage(ev.image);
          }
        } catch {
          Alert.alert("Error", "Could not load event details.");
        }
      })();
  }, [editId]);

  const parseDate = (dStr: string, tStr: string) => {
    const dParts = dStr.split("/");
    if (dParts.length !== 3) return new Date(NaN);

    const month = parseInt(dParts[0], 10) - 1;
    const day = parseInt(dParts[1], 10);
    const year = parseInt(dParts[2], 10);

    const tParts = (tStr || "00:00").split(":");
    const hour = parseInt(tParts[0], 10) || 0;
    const minute = parseInt(tParts[1], 10) || 0;

    const date = new Date(year, month, day, hour, minute);
    return date;
  };

  const handlePublish = async () => {
    if (isPublishing) return;
    const showAlert = (title: string, message: string) =>
      Platform.OS === "web"
        ? alert(`${title}\n\n${message}`)
        : Alert.alert(title, message);

    const newErrors: any = {};
    ["title", "startDate", "startTime", "endDate", "endTime", "location", "description"].forEach(f => {
      if (!form[f as keyof typeof form]) newErrors[f] = "Required";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showAlert("Missing Fields", "Please fill in all required fields.");
      return;
    }
    setErrors({});

    try {
      setIsPublishing(true);
      const sDate = parseDate(form.startDate, form.startTime),
        eDate = parseDate(form.endDate, form.endTime);
      if (isNaN(sDate.getTime()) || isNaN(eDate.getTime())) {
        showAlert(
          "Invalid Dates",
          "Please enter valid dates in mm/dd/yyyy format",
        );
        return;
      }

      const payload = {
        ...form,
        startDate: sDate,
        endDate: eDate,
        tags,
        image: image || undefined,
      };
      const { data } = isEditing
        ? await apiClient.put(`/events/${editId}`, payload)
        : await apiClient.post("/events", payload);

      if (data.success) {
        setSuccessMessage(
          isEditing
            ? "Event updated successfully!"
            : "Event published successfully!",
        );
        setShowSuccessModal(true);
      } else showAlert("Error", data.message || "Something went wrong");
    } catch (error: any) {
      showAlert(
        "Error",
        error.response?.data?.message || "An error occurred during publishing",
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const updateForm = (field: string, text: string) => {
    let formattedText = text;

    if (field === "startDate" || field === "endDate") {
      const digits = text.replace(/\D/g, "");
      if (digits.length <= 2) formattedText = digits;
      else if (digits.length <= 4)
        formattedText = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      else
        formattedText = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    } else if (field === "startTime" || field === "endTime") {
      const digits = text.replace(/\D/g, "");
      if (digits.length <= 2) formattedText = digits;
      else formattedText = `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
    }

    setForm((prev) => ({ ...prev, [field]: formattedText }));
    if (errors[field]) setErrors(({ [field]: _, ...rest }: any) => rest);
  };

  return (
    <FormScreen
      title={isEditing ? "Edit event" : "New event"}
      subtitle="Fill in the details to curate your campus experience"
      submitLabel={isEditing ? "Update event" : "Publish event"}
      onSubmit={handlePublish}
      submitting={isPublishing}
    >
      <PhotoPicker
        label="Cover photo"
        uri={image}
        onPress={pickImage}
        height={180}
        hint={isPicking ? "Loading..." : "Add a cover photo"}
      />

      <TextField
        label="Event title"
        placeholder="e.g. Design Symposium"
        value={form.title}
        onChangeText={(text) => updateForm("title", text)}
        error={errors.title}
        required
      />

      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 3 }}>
          <TextField
            label="Start date"
            placeholder="mm/dd/yyyy"
            value={form.startDate}
            onChangeText={(text) => updateForm("startDate", text)}
            keyboardType="number-pad"
            error={errors.startDate}
            required
            right={<FieldIcon icon={CalendarIcon} label="Pick start date" onPress={() => openCalendar("startDate")} />}
          />
        </View>
        <View style={{ flex: 2 }}>
          <TextField
            label="Time"
            placeholder="00:00"
            value={form.startTime}
            onChangeText={(text) => updateForm("startTime", text)}
            keyboardType="number-pad"
            error={errors.startTime}
            required
            right={<FieldIcon icon={Clock} label="Pick start time" onPress={() => openTimePicker("startTime")} />}
          />
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 3 }}>
          <TextField
            label="End date"
            placeholder="mm/dd/yyyy"
            value={form.endDate}
            onChangeText={(text) => updateForm("endDate", text)}
            keyboardType="number-pad"
            error={errors.endDate}
            required
            right={<FieldIcon icon={CalendarIcon} label="Pick end date" onPress={() => openCalendar("endDate")} />}
          />
        </View>
        <View style={{ flex: 2 }}>
          <TextField
            label="Time"
            placeholder="00:00"
            value={form.endTime}
            onChangeText={(text) => updateForm("endTime", text)}
            keyboardType="number-pad"
            error={errors.endTime}
            required
            right={<FieldIcon icon={Clock} label="Pick end time" onPress={() => openTimePicker("endTime")} />}
          />
        </View>
      </View>

      <TextField
        label="Venue / location"
        placeholder="Innovation Hub, Room 402"
        value={form.location}
        onChangeText={(text) => updateForm("location", text)}
        error={errors.location}
        required
        right={<MapPin size={20} color={colors.textMuted} />}
      />

      <TextField
        label="About the event"
        placeholder="Describe your event here..."
        value={form.description}
        onChangeText={(text) => updateForm("description", text)}
        multiline
        error={errors.description}
        required
      />

      <View style={{ gap: 10 }}>
        <TextField
          label="Event tags"
          placeholder="Add a tag (e.g. Workshop)"
          value={tagInput}
          onChangeText={setTagInput}
          returnKeyType="done"
          onSubmitEditing={addTag}
          right={<FieldIcon icon={Plus} label="Add tag" onPress={addTag} />}
        />

        {tags.length > 0 ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {tags.map((tag, index) => (
              <View
                key={`${tag}-${index}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  paddingLeft: 14,
                  paddingRight: 10,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: colors.primaryLight,
                }}
              >
                <AppText variant="bodyStrong" tone="primary" style={{ fontSize: 13 }}>
                  {tag}
                </AppText>
                <Pressable accessibilityLabel={`Remove ${tag}`} onPress={() => removeTag(index)} hitSlop={8}>
                  <X size={14} color={colors.primary} strokeWidth={3} />
                </Pressable>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <DatePickerModal
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        onSelectDate={handleSelectDate}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
      />

      <TimePickerModal
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onSelectTime={handleSelectTime}
      />

      <SuccessModal
        visible={showSuccessModal}
        title="Excellent!"
        message={successMessage}
        actionLabel="Continue to events"
        onClose={() => router.replace("/events")}
      />
    </FormScreen>
  );
}
