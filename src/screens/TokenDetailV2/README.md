# Token Detail V2 - Testing Documentation

## Overview

Token Detail V2 là phiên bản mới của trang Token Detail với design cải tiến từ Figma, hiển thị đầy đủ thông tin về token bao gồm price chart, stats, investors, exchanges, và TGE information.

## Route

```
/token-v2/[symbol]
```

Ví dụ:

- `/token-v2/xpl`
- `/token-v2/btc`
- `/token-v2/eth`

## Features

### ✅ Completed Features

1. **Token Header Section**
   - Logo, name, và symbol của token
   - Social links (Twitter, Discord, Telegram)
   - Description
   - Category tags (Layer 1, Ethereum, Mainnet, etc.)
   - Create Order button

2. **Chart & Stats Section**
   - Price display với % change
   - Time period filters (24h, 7d, 1m, 3m, 1y)
   - Chart placeholder (ready for integration)
   - Market Cap & FDV
   - Circulating Supply với progress bar
   - Total Supply, Max Supply, Volume 24h
   - Performance metrics grid

3. **Social Metrics Section**
   - Twitter Followers
   - Discord Members
   - Telegram Followers
   - GitHub Stars

4. **Investors Section**
   - Danh sách investors với avatar
   - Investor type (Angel Investor, Ventures Capital)
   - Tier badges (Tier 1, 2, 3, Not Rated)
   - Color coded tiers

5. **Exchanges Section**
   - Danh sách exchanges
   - Trading pairs
   - Price và Volume 24h

6. **TGE Information Section**
   - TGE Date
   - TGE Exchange
   - Additional metrics

### 📱 Responsive Design

- ✅ Mobile responsive (< 768px)
- ✅ Tablet responsive (768px - 1024px)
- ✅ Desktop (> 1024px)

## Data Sources

### Internal API

- Token basic info từ `/tokens/:symbol`
- Token offers (ready for integration)

### External API

- Token extended info từ Web3 Radar API
- Investors, Exchanges, TGE info
- Community metrics

### Mock Data

- Mock data được sử dụng khi API không trả về data
- Mỗi component có fallback data để test UI

## Testing Steps

### 1. Test Route

```bash
# Navigate to token-v2 route
http://localhost:3000/token-v2/xpl
```

### 2. Test with Different Tokens

```bash
# Test với token có data
http://localhost:3000/token-v2/xpl
http://localhost:3000/token-v2/btc

# Test với token không có external data
http://localhost:3000/token-v2/unknown
```

### 3. Test Responsive

- Resize browser window
- Test trên mobile device
- Test trên tablet
- Test trên desktop

### 4. Test Tabs

- Switch giữa "Info" và "Trade" tabs
- Verify data hiển thị đúng

### 5. Test Links

- Click vào social links (Twitter, Discord, Telegram)
- Verify links open trong tab mới

## Components Structure

```
src/screens/TokenDetailV2/
├── index.tsx                    # Main screen component
├── components/
│   ├── TokenDetailHeader.tsx    # Header with token info
│   ├── TokenChart.tsx           # Chart và stats
│   ├── TokenSocial.tsx          # Social metrics
│   ├── TokenInvestors.tsx       # Investors list
│   ├── TokenExchanges.tsx       # Exchanges list
│   └── TokenTGE.tsx             # TGE information
└── README.md                    # This file
```

## Styling

### Colors (từ Figma Design)

- **Background**: `#000000` (Black)
- **Foreground**: `#fefefc` (White)
- **Border**: `#27292b` (Dark Gray)
- **Muted**: `#898b8d` (Gray)
- **Layer 2**: `#141414` (Dark)
- **Success**: `#63eb97` (Green)
- **Warning**: `#f4b250` (Amber)
- **Danger**: `#ef6663` (Red)
- **Orange**: `#e88144` (Orange)

### Font

- **Family**: SF Pro Display (imported từ CDN)
- **Weights**: Regular (400), Medium (500), Semibold (600)

## Integration Notes

### Chart Integration

Chart section hiện tại là placeholder. Để integrate:

1. Chọn chart library (recommended: TradingView, recharts)
2. Fetch chart data từ API
3. Replace placeholder trong `TokenChart.tsx`

### Trade Tab Integration

Trade tab hiện tại là placeholder. Để integrate:

1. Import existing OfferList component
2. Add filter functionality
3. Connect to offers API

## Known Issues & Limitations

1. **Chart Data**: Mock data, cần integrate với chart library
2. **Performance Metrics**: Hardcoded values, cần API integration
3. **Trade Tab**: Placeholder, cần integrate với existing trade view

## Next Steps

1. ✅ Create components
2. ✅ Add responsive design
3. ✅ Setup colors and styling
4. ⏳ Integrate real chart data
5. ⏳ Connect Trade tab with offers
6. ⏳ Add loading states
7. ⏳ Add error handling
8. ⏳ Performance optimization

## Testing Checklist

- [ ] Route `/token-v2/:symbol` hoạt động
- [ ] Token header hiển thị đúng
- [ ] Chart placeholder hiển thị
- [ ] Stats section hiển thị đúng data
- [ ] Social metrics hiển thị
- [ ] Investors list hiển thị
- [ ] Exchanges list hiển thị
- [ ] TGE info hiển thị
- [ ] Responsive trên mobile
- [ ] Responsive trên tablet
- [ ] Responsive trên desktop
- [ ] Social links hoạt động
- [ ] Tab navigation hoạt động
- [ ] Create Order button hiển thị

## Support

Nếu có vấn đề hoặc câu hỏi:

1. Check browser console cho errors
2. Verify API endpoints đang hoạt động
3. Check network tab cho API responses
4. Review component props và data flow

## Demo URLs

```bash
# Test với token có full data
http://localhost:3000/token-v2/xpl

# So sánh với version cũ
http://localhost:3000/token/xpl
```
