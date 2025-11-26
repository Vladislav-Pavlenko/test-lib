"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

interface Subject {
  id: number;
  name: string;
}

interface Author {
  id: number;
  name: string;
}

interface Test {
  id: number;
  title: string;
  description: string;
  topic: string;
  grade: number;
  link: string;
  subjectId: number;
  subjectRel: Subject;
  authorId?: number;
  author?: Author;
}

export default function Page() {
  const [tests, setTests] = useState<Test[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [form, setForm] = useState({
    title: "",
    topic: "",
    grade: 1,
    description: "",
    link: "",
    subjectId: 0,
    authorId: 0,
  });

  // --- Фільтри ---
  const [titleFilter, setTitleFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState(0);
  const [gradeFilter, setGradeFilter] = useState(0);
  const [authorFilter, setAuthorFilter] = useState(0);

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newAuthorName, setNewAuthorName] = useState("");

  useEffect(() => {
    fetchTests();
    fetchSubjects();
    fetchAuthors();
  }, []);

  const fetchTests = async (filters?: any) => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.title) params.append("title", filters.title);
      if (filters.subject) params.append("subject", String(filters.subject));
      if (filters.grade) params.append("grade", String(filters.grade));
      if (filters.authorId) params.append("authorId", String(filters.authorId));
    }
    const res = await fetch(`/api/tests?${params.toString()}`);
    const data = await res.json();
    setTests(data);
  };

  const fetchSubjects = async () => {
    const res = await fetch("/api/subjects");
    const data = await res.json();
    setSubjects(data);
  };

  const fetchAuthors = async () => {
    const res = await fetch("/api/authors");
    const data = await res.json();
    setAuthors(data);
  };

  // --- Додавання тесту ---
  const addTest = async () => {
    if (!form.title || !form.link || !form.subjectId) {
      alert("Заповни обов’язкові поля: Назва, Посилання та Предмет!");
      return;
    }

    const res = await fetch("/api/tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) return alert("Помилка при додаванні тесту");

    const newTest = await res.json();
    setTests([newTest, ...tests]);
    setForm({
      title: "",
      topic: "",
      grade: 1,
      description: "",
      link: "",
      subjectId: 0,
      authorId: 0,
    });
  };

  // --- Додавання нового предмету ---
  const addSubject = async () => {
    if (!newSubjectName) return;
    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newSubjectName }),
    });
    if (!res.ok) return alert("Помилка при додаванні предмету");
    const s = await res.json();
    setSubjects([...subjects, s]);
    setNewSubjectName("");
    setShowSubjectModal(false);
  };

  // --- Додавання нового автора ---
  const addAuthor = async () => {
    if (!newAuthorName) return;
    const res = await fetch("/api/authors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newAuthorName }),
    });
    if (!res.ok) return alert("Помилка при додаванні автора");
    const a = await res.json();
    setAuthors([...authors, a]);
    setNewAuthorName("");
    setShowAuthorModal(false);
  };

  // --- Видалення тесту ---
  const deleteTest = async (id: number) => {
    if (!confirm("Видалити цей тест?")) return;
    await fetch(`/api/tests?id=${id}`, { method: "DELETE" });
    setTests(tests.filter((t) => t.id !== id));
  };

  // --- Застосувати фільтри ---
  const applyFilters = () => {
    fetchTests({
      title: titleFilter,
      subject: subjectFilter,
      grade: gradeFilter,
      authorId: authorFilter,
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📚 Бібліотека тестів</h1>

      {/* Фільтри */}
      <div className={styles.filters}>
        <input
          placeholder="Фільтр по назві"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          className={styles.input}
        />
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(Number(e.target.value))}
          className={styles.select}
        >
          <option value={0}>Всі предмети</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          max={11}
          placeholder="Фільтр по класу"
          value={gradeFilter}
          onChange={(e) => setGradeFilter(Number(e.target.value))}
          className={styles.input}
        />
        <select
          value={authorFilter}
          onChange={(e) => setAuthorFilter(Number(e.target.value))}
          className={styles.select}
        >
          <option value={0}>Всі автори</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <button onClick={applyFilters} className={styles.buttonPrimary}>
          Застосувати
        </button>
      </div>

      {/* Форма тесту */}
      <div className={styles.form}>
        <input
          placeholder="Назва тесту"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={styles.input}
        />
        <input
          placeholder="Тема"
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
          className={styles.input}
        />
        <input
          type="number"
          min={1}
          max={11}
          placeholder="Клас"
          value={form.grade}
          onChange={(e) => setForm({ ...form, grade: Number(e.target.value) })}
          className={styles.input}
        />
        <input
          placeholder="Опис"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={styles.input}
        />
        <input
          placeholder="Посилання на тест"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          className={styles.input}
        />

        {/* Select предметів */}
        <div className={styles.selectWrapper}>
          <select
            value={form.subjectId}
            onChange={(e) =>
              setForm({ ...form, subjectId: Number(e.target.value) })
            }
            className={styles.select}
          >
            <option value={0}>Виберіть предмет</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowSubjectModal(true)}
            className={styles.buttonSmall}
          >
            ➕
          </button>
        </div>

        {/* Select авторів */}
        <div className={styles.selectWrapper}>
          <select
            value={form.authorId || 0}
            onChange={(e) =>
              setForm({ ...form, authorId: Number(e.target.value) })
            }
            className={styles.select}
          >
            <option value={0}>Виберіть автора</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowAuthorModal(true)}
            className={styles.buttonSmall}
          >
            ➕
          </button>
        </div>

        <button onClick={addTest} className={styles.buttonPrimary}>
          ➕ Додати тест
        </button>
      </div>

      {/* Таблиця тестів */}
      {tests.length === 0 ? (
        <p className={styles.empty}>Поки що немає тестів 😔</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Назва</th>
              <th>Предмет</th>
              <th>Тема</th>
              <th>Клас</th>
              <th>Опис</th>
              <th>Автор</th>
              <th>Посилання</th>
              <th>Дія</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((t) => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>{t.subjectRel.name}</td>
                <td>{t.topic}</td>
                <td>{t.grade}</td>
                <td>{t.description}</td>
                <td>{t.author?.name || "—"}</td>
                <td>
                  <a href={t.link} target="_blank" rel="noreferrer">
                    Відкрити
                  </a>
                </td>
                <td>
                  <button
                    onClick={() => deleteTest(t.id)}
                    className={styles.buttonDanger}
                  >
                    Видалити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Модальні вікна */}
      {showSubjectModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Додати предмет</h3>
            <input
              placeholder="Назва предмету"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              className={styles.input}
            />
            <div className={styles.modalActions}>
              <button onClick={addSubject} className={styles.buttonPrimary}>
                Додати
              </button>
              <button
                onClick={() => setShowSubjectModal(false)}
                className={styles.buttonDanger}
              >
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}

      {showAuthorModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Додати автора</h3>
            <input
              placeholder="Ім'я автора"
              value={newAuthorName}
              onChange={(e) => setNewAuthorName(e.target.value)}
              className={styles.input}
            />
            <div className={styles.modalActions}>
              <button onClick={addAuthor} className={styles.buttonPrimary}>
                Додати
              </button>
              <button
                onClick={() => setShowAuthorModal(false)}
                className={styles.buttonDanger}
              >
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
