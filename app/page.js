'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [book, setBook] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [reviewName, setReviewName] = useState('');
  const [reviewContent, setReviewContent] = useState('');

  const [questionName, setQuestionName] = useState('');
  const [questionContent, setQuestionContent] = useState('');

  const [loading, setLoading] = useState(false);

  // 페이지가 처음 열릴 때 데이터 불러오기
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    // 현재 읽는 도서 1개 가져오기
    const { data: bookData } = await supabase
      .from('books')
      .select('*')
      .eq('is_current', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // 모임 일정 가져오기
    const { data: meetingData } = await supabase
      .from('meetings')
      .select('*')
      .order('meeting_date', { ascending: true });

    // 한줄평 가져오기
    const { data: reviewData } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    // 질문 가져오기
    const { data: questionData } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });

    setBook(bookData);
    setMeetings(meetingData || []);
    setReviews(reviewData || []);
    setQuestions(questionData || []);
  }

  // 한줄평 등록
  async function submitReview(e) {
    e.preventDefault();

    if (!reviewName.trim() || !reviewContent.trim()) {
      alert('이름과 한줄평을 모두 입력해주세요.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('reviews').insert({
      name: reviewName,
      content: reviewContent,
    });

    setLoading(false);

    if (error) {
      alert('한줄평 등록 중 오류가 발생했습니다.');
      console.error(error);
      return;
    }

    setReviewName('');
    setReviewContent('');
    fetchData();
  }

  // 질문 등록
  async function submitQuestion(e) {
    e.preventDefault();

    if (!questionName.trim() || !questionContent.trim()) {
      alert('이름과 질문을 모두 입력해주세요.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('questions').insert({
      name: questionName,
      content: questionContent,
    });

    setLoading(false);

    if (error) {
      alert('질문 등록 중 오류가 발생했습니다.');
      console.error(error);
      return;
    }

    setQuestionName('');
    setQuestionContent('');
    fetchData();
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="badge">Book Club Dashboard</p>
          <h1>📚 우리 독서모임</h1>
          <p className="subtitle">
            함께 읽고, 생각을 나누고, 다음 모임을 준비하는 공간입니다.
          </p>
        </div>
      </section>

      <section className="grid two">
        <article className="card book-card">
          <h2>📖 이번에 읽을 도서</h2>

          {book ? (
            <div>
              {book.cover_url ? (
                <img className="cover" src={book.cover_url} alt={book.title} />
              ) : (
                <div className="cover empty-cover">책 표지</div>
              )}

              <h3>{book.title}</h3>
              <p className="muted">{book.author}</p>
              <p>{book.description}</p>
            </div>
          ) : (
            <p>현재 등록된 도서가 없습니다.</p>
          )}
        </article>

        <article className="card">
          <h2>📅 모임 일정</h2>

          <div className="calendar-list">
            {meetings.length > 0 ? (
              meetings.map((meeting) => (
                <div className="calendar-item" key={meeting.id}>
                  <div className="date-box">
                    <strong>{new Date(meeting.meeting_date).getDate()}</strong>
                    <span>
                      {new Date(meeting.meeting_date).getMonth() + 1}월
                    </span>
                  </div>

                  <div>
                    <h3>{meeting.title}</h3>
                    <p>
                      {meeting.meeting_date} {meeting.meeting_time}
                    </p>
                    <p className="muted">{meeting.location}</p>
                    <p>{meeting.memo}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>등록된 일정이 없습니다.</p>
            )}
          </div>
        </article>
      </section>

      <section className="grid two">
        <article className="card">
          <h2>💬 한줄평 남기기</h2>

          <form onSubmit={submitReview} className="form">
            <input
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              placeholder="이름"
            />

            <textarea
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder="책에 대한 한줄평을 적어주세요."
            />

            <button disabled={loading}>
              {loading ? '등록 중...' : '한줄평 등록'}
            </button>
          </form>
        </article>

        <article className="card">
          <h2>❓ 토론 질문 남기기</h2>

          <form onSubmit={submitQuestion} className="form">
            <input
              value={questionName}
              onChange={(e) => setQuestionName(e.target.value)}
              placeholder="이름"
            />

            <textarea
              value={questionContent}
              onChange={(e) => setQuestionContent(e.target.value)}
              placeholder="모임에서 이야기하고 싶은 질문을 적어주세요."
            />

            <button disabled={loading}>
              {loading ? '등록 중...' : '질문 등록'}
            </button>
          </form>
        </article>
      </section>

      <section className="grid two">
        <article className="card">
          <h2>최근 한줄평</h2>

          <div className="post-list">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div className="post" key={review.id}>
                  <strong>{review.name}</strong>
                  <p>{review.content}</p>
                  <span>{new Date(review.created_at).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p>아직 한줄평이 없습니다.</p>
            )}
          </div>
        </article>

        <article className="card">
          <h2>최근 토론 질문</h2>

          <div className="post-list">
            {questions.length > 0 ? (
              questions.map((question) => (
                <div className="post" key={question.id}>
                  <strong>{question.name}</strong>
                  <p>{question.content}</p>
                  <span>{new Date(question.created_at).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p>아직 질문이 없습니다.</p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}