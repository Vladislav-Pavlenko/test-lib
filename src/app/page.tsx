"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

interface Test {
  id: number;
  title: string;
  description: string;
  subject: string;
  topic: string;
  grade: number;
  link: string;
}

export default function TestLibrary() {
  const [tests, setTests] = useState<Test[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    topic: "",
    grade: 1,
    link: "",
  });

  // Завантаження тестів при старті
  useEffect(() => {
    fetch("/api/tests")
      .then((r) => r.json())
      .then(setTests)
      .catch(() => setTests([]));
  }, []);

  // Додавання нового тесту
  const addTest = async () => {
    if (!form.title || !form.subject || !form.link) {
      alert("Заповни обов’язкові поля: Назва, Предмет і Посилання!");
      return;
    }

    const res = await fetch("/api/tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Помилка при додаванні тесту");
      return;
    }

    const newTest = await res.json();
    setTests([newTest, ...tests]);
    setForm({
      title: "",
      description: "",
      subject: "",
      topic: "",
      grade: 1,
      link: "",
    });
  };

  // Видалення тесту
  const deleteTest = async (id: number) => {
    if (!confirm("Видалити цей тест?")) return;
    await fetch(`/api/tests?id=${id}`, { method: "DELETE" });
    setTests(tests.filter((t) => t.id !== id));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📚 Бібліотека тестів</h1>

      <div className={styles.form}>
        <input
          className={styles.input}
          placeholder="Назва тесту"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className={styles.input}
          placeholder="Предмет"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />
        <input
          className={styles.input}
          placeholder="Тема"
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
        />
        <input
          className={styles.input}
          type="number"
          min="1"
          max="11"
          placeholder="Клас"
          value={form.grade}
          onChange={(e) => setForm({ ...form, grade: Number(e.target.value) })}
        />
        <input
          className={styles.input}
          placeholder="Опис"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className={styles.input}
          placeholder="Посилання на тест"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
        />
        <button onClick={addTest} className={styles.buttonPrimary}>
          ➕ Додати тест
        </button>
      </div>

      {tests.length === 0 ? (
        <p className={styles.empty}>Поки що немає тестів 😔</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.th}>Назва</th>
              <th className={styles.th}>Предмет</th>
              <th className={styles.th}>Тема</th>
              <th className={styles.th}>Клас</th>
              <th className={styles.th}>Опис</th>
              <th className={styles.th}>Посилання</th>
              <th className={styles.th}>Дія</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((t) => (
              <tr className={styles.tr} key={t.id}>
                <td className={styles.td}>{t.title}</td>
                <td className={styles.td}>{t.subject}</td>
                <td className={styles.td}>{t.topic}</td>
                <td className={styles.td}>{t.grade}</td>
                <td className={styles.td}>{t.description}</td>
                <td className={styles.td}>
                  <a
                    className={styles.a}
                    href={t.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Відкрити
                  </a>
                </td>
                <td className={styles.td}>
                  <button
                    className={styles.buttonDanger}
                    onClick={() => deleteTest(t.id)}
                  >
                    Видалити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
