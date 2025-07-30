'use client';
import Link from 'next/link';

const features = [
  {
    path: '/test/v1/auth',
    title: 'Đăng nhập bằng ví',
    desc: 'Kết nối ví, đăng nhập hệ thống bằng MetaMask hoặc Solana.',
  },
  {
    path: '/test/v1/products',
    title: 'Xem danh sách sản phẩm (Offers)',
    desc: 'Xem, tìm kiếm, lọc, sắp xếp các sản phẩm/token đang niêm yết.',
  },
  {
    path: '/test/v1/wallets-deposit-test',
    title: 'Nạp tiền test vào ví',
    desc: 'Chọn token và nạp tiền test vào ví của bạn để thử mua bán.',
  },
];

export default function V1TestMenu() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center bg-[#10141c] py-16">
      <h1 className="mb-8 text-3xl font-bold text-blue-400">Menu Test Nghiệp Vụ v1</h1>
      <div className="flex w-full max-w-xl flex-col gap-6">
        {features.map((f) => (
          <Link
            key={f.path}
            href={f.path}
            className="group block rounded-xl border border-[#232a3a] bg-[#181e2a] p-6 shadow transition hover:shadow-lg"
          >
            <div className="mb-1 text-xl font-bold text-primary group-hover:text-blue-400">
              {f.title}
            </div>
            <div className="text-sm text-gray-400">{f.desc}</div>
            <div className="mt-2 text-xs text-blue-300">{f.path}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
