"use client";

import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import styles from "./Notes.module.css";

export default function FilterPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = use(params);
  const currentSlug = slug?.[0] === "all" ? undefined : slug?.[0];

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes", currentSlug],
    queryFn: async () => {
      const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

      const response = await axios.get(
        "https://notehub-public.goit.study/api/notes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (currentSlug) {
        return response.data.filter(
          (note: any) =>
            note.category.toLowerCase() === currentSlug.toLowerCase()
        );
      }
      return response.data;
    },
  });

  if (isLoading)
    return <div className={styles.loading}>Завантаження нотаток...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {currentSlug ? `Category: ${currentSlug}` : "All notes"}
      </h1>

      <div className={styles.list}>
        {notes && notes.length > 0 ? (
          notes.map((note: any) => (
            <div key={note.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.tag}>{note.category}</span>
              </div>
              <h3 className={styles.cardTitle}>{note.title}</h3>
              <p className={styles.cardContent}>{note.content}</p>
            </div>
          ))
        ) : (
          <p className={styles.empty}>У цій категорії поки немає нотаток.</p>
        )}
      </div>
    </div>
  );
}
