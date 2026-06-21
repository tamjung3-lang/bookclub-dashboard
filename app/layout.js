import './globals.css';

export const metadata = {
  title: '우리 독서모임',
  description: '독서모임 일정, 도서, 한줄평, 질문 게시판',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}