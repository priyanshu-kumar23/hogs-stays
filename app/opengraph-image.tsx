import { ImageResponse } from 'next/og';
export const alt = 'HOGS — Of Himalayan Homes. A mountain stay and cafe in Manali.';
export const size = {width:1200,height:630};
export const contentType = 'image/png';
export default function Image() { return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',background:'#1F2A24',color:'#F4F1EC',border:'24px solid #293b2f'}}><div style={{fontSize:22,letterSpacing:8,color:'#D9822B'}}>OF HIMALAYAN HOMES</div><div style={{fontSize:190,fontFamily:'serif',lineHeight:1.15}}>HOGS</div><div style={{fontSize:36}}>Two mountain stays. One beautiful feeling.</div><div style={{fontSize:18,marginTop:40,letterSpacing:5,color:'#A9B1B6'}}>MANALI · HIMACHAL PRADESH</div></div>,size); }
