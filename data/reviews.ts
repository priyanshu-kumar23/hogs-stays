// Guest reviews shown in the "Guest Reviews" section. Edit this file to add, remove or fix reviews.
// Text is the guests' own words — only change it to fix typos.

/** Public Google reviews link for HOGS Stays (used by "Read all reviews on Google" and "Write a review"). */
export const GOOGLE_REVIEWS_URL = 'https://share.google/tMNBbzRVD7y3T50DP';

export interface Review {
  name: string;
  /** Free-form month label, e.g. "June 2026". */
  date: string;
  rating: 1 | 2 | 3 | 4 | 5;
  source: 'google';
  text: string;
  /** e.g. "Holiday · Couple" */
  tripType?: string;
  /** Short keyword chips, e.g. ["Views", "Hospitality"]. Not shown if empty. */
  highlights?: string[];
}

export const reviews: Review[] = [
  {
    name: 'akash pakanati', date: 'June 2026', rating: 5, source: 'google',
    text: `Exceptional Stay at Hogs Panorama, Manali! Our stay at Hogs Panorama was truly memorable and exceeded all our expectations. The hotel offers breathtaking views of the snow-capped Himalayas right from the room balcony, making every morning and evening feel magical. The rooms are modern, spacious, spotlessly clean, and very well maintained. Waking up to such stunning mountain views was undoubtedly one of the highlights of our trip. What truly sets this property apart, however, is its outstanding hospitality. A special thanks to Saloni, Geens, and Kapil, who run the entire show with incredible warmth, professionalism, and genuine care for their guests. They were always welcoming, highly interactive, and went above and beyond to ensure our stay was comfortable and enjoyable. We were especially impressed by how they customized our breakfast and dinner preferences, making us feel more like family than guests. The food was absolutely delicious throughout our stay, with every meal prepared thoughtfully and served with great attention to detail. It is rare to come across hosts who combine such warmth, attentiveness, and hospitality so effortlessly. Saloni, Geens, and Kapil are truly the heart and soul of this property. If you're visiting Manali and looking for spectacular Himalayan views, clean and comfortable rooms, delicious food, and hospitality that makes you feel at home, Hogs Panorama is the perfect choice. Highly recommended, and we look forward to returning again soon!`,
  },
  {
    name: 'Farheen Shaikh', date: 'July 2026', rating: 5, source: 'google', tripType: 'Holiday · Couple',
    text: `Some places give you a vacation; HOGS gives you a pause button. Tucked away from the chaos of city life, it offers breathtaking, uninterrupted views of the mountains that seem to stretch on forever. Mornings begin with crisp air, stunning vistas, and a sense of calm that's hard to find these days. The food deserves a special mention—wholesome, flavourful, home-cooked meals that feel like a warm hug. Paired with truly exceptional drinks (my must haves - Biscoff frappe, Hogs special hot chocolate, Hazelnut iced latte) every meal became an experience in itself. What made our stay even more memorable were the hosts- Kapil, Gaz, Saloni and their entire team. Their warmth, kindness, and effortless hospitality made us feel less like guests and more like friends visiting their home. Above all, this place offers something increasingly rare: peace. The kind that lets you slow down, breathe deeply, and forget about traffic, deadlines, notifications, and the summer heat. If you're craving a soulful escape into nature, this little slice of paradise is exactly where you need to be.`,
  },
  {
    name: 'Devinder Kaur', date: 'June 2026', rating: 5, source: 'google', tripType: 'Holiday · Family',
    text: `A True Home Away from Home in Manali! If you are looking for a place in Manali that feels less like a commercial stay and more like visiting old friends, "Hogs Stays" is absolutely it. From the moment I arrived, the warmth of the place completely won me over. The property itself is lovely and comfortable, but what truly sets this homestay apart is the incredible hospitality of the owners, "Gazal and Saloni". They are the absolute heart and soul of this place. I instantly vibed with them, they are incredibly welcoming, down-to-earth, and genuine. What started as a standard check-in quickly turned into long conversations, shared laughs, and making great new friends. A massive highlight of the stay was definitely the food, especially the most amazing dessert called "Eat on Mess" specially curated by Gazal. It is an absolute masterpiece and truly the OG dish of Hogs Stay! You cannot leave without trying it, it's worth the trip alone. Between the unforgettable food and the amazing company, it truly felt like a home away from home. I left Manali not just with great memories of the mountains, but with wonderful new friendships. I cannot recommend Hogs Stay enough, and I'm already looking forward to my next visit!`,
  },
  {
    name: 'Pinky Agarwal', date: 'June 2026', rating: 5, source: 'google', tripType: 'Holiday · Friends',
    text: `Had an excellent experience at this hotel. It truly felt like a home away from home. The owners are बेहद warm and welcoming, and they make every guest feel like family. ❤️ The hotel has beautiful mountain views and such peaceful vibes. Everything was very comfortable and pleasant. I would definitely love to visit again! 😊`,
  },
  {
    name: 'Mohammed Noufal', date: 'June 2026', rating: 5, source: 'google', tripType: 'Holiday · Couple',
    text: `I recently stayed at Hogstay and had a really great experience. The rooms were spacious, very clean, well-maintained, and had a cozy atmosphere that made the stay very comfortable. The interiors and overall ambience were impressive and gave a relaxing feel throughout the stay. The food was another highlight — everything we tried was fresh, tasty, and well prepared. The service was excellent, and the staff members were always polite, friendly, and ready to help with a smile. Their hospitality truly made us feel welcomed and cared for. Overall, it was a memorable and comfortable stay, and I would definitely recommend Hogstay to anyone looking for good rooms, delicious food, and warm hospitality.`,
  },
  {
    name: 'Naga Pisipati', date: 'July 2026', rating: 5, source: 'google', tripType: 'Holiday · Couple',
    text: `What an amazing dining experience! We chose to sit on the terrace, and the breathtaking view made the meal even more memorable. The ambiance was peaceful, beautiful, and the perfect setting to enjoy great food. The spicy momos were absolutely delicious, and the Hamshuka was just as incredible, both dishes were truly chef's kiss! Every bite was packed with flavor and cooked to perfection. To top it all off, the coffee was outstanding, rich and aromatic. The hospitality was exceptional as well. The host was incredibly friendly and welcoming, making us feel right at home from the moment we arrived. The service was prompt, attentive, and genuinely warm throughout our visit. From the delicious food and amazing coffee to the stunning terrace view and outstanding hospitality, everything about this place exceeded expectations. I highly recommend it to anyone looking for a memorable dining experience, and I'll definitely be coming back!`,
  },
  {
    name: 'Aviral Saxena', date: 'April 2026', rating: 5, source: 'google',
    text: `Stayed at HOGS – Panorama recently and it was an amazing experience. The property is beautifully located with panoramic mountain views and a very peaceful setting. The rooms are thoughtfully designed with all the necessary amenities and a cozy feel. The hospitality is excellent — the hosts are very helpful and welcoming. Their in-house café DO NTHNG adds a unique charm to the place. Loved the coffee and the overall vibe, especially in the evenings. Perfect for couples and travelers looking for a calm and comfortable stay in Manali. Definitely coming back again!`,
  },
  {
    name: 'Shreedhar Pathak', date: 'July 2026', rating: 5, source: 'google',
    text: `Me and my wife had an amazing tour of offbeat Himachal Pradesh. We started our tour by staying at HOGS @Shuru. It is situated next to Byas River and has beautiful view of snow clad Mountain peaks. HOGS is started by Ghazal and Saloni, two close friends, who are passionate riders. They are ably assisted by Kapil and Samyak. Hospitality is in the blood of these four teammates. They take care of guests staying with them as family members. Right from Breakfast to dinner, one can observe attention to details and close supervision to make each meal an experience in itself. Every evening spent at "Do Nothing" cafe is engraved into my mind and heart forever. HOGS is an excellent example of how to achieve the golden mean of Hotel and homestay. Apart from extremely satisfying experience, we made some excellent friends there!`,
  },
  {
    name: 'Pratik Rajoria', date: 'April 2026', rating: 5, source: 'google',
    text: `Had an absolutely wonderful stay at this beautiful property in Manali! The views are simply breathtaking. Waking up to the mountains every morning felt surreal. The food was another highlight, fresh, delicious, and made with so much care. A special mention to Saloni and Gazal, who are truly amazing hosts. They go above and beyond to make sure every guest feels comfortable and at home. Their warmth and hospitality really made the experience even more special. Highly recommend this place to anyone visiting Manali. It's the perfect blend of scenic beauty, great food, and heartfelt hospitality!`,
  },
  {
    name: 'Anjali Kale', date: 'June 2026', rating: 5, source: 'google',
    text: `We reached this hotel late evening after a long hectic day and extremely irritated due to chaotic traffic after crossing Atal tunnel. Swearing that we will never visit this place. But the warmth we received by Gazal, Saloni and their team lifted our moods instantly. The food was served with love. The comfortable rooms recharged us thoroughly. Morning was mesmerizing!! As a traveller we don't get attached to any place emotionally. But here the true warmth made it difficult for us to leave this place. We swore that we will visit this place again.`,
  },
  {
    name: 'Angel Patil', date: 'June 2026', rating: 5, source: 'google', tripType: 'Holiday · Friends',
    text: `We had a wonderful stay in Manali. The HOGS offered breathtaking mountain views from the room and balcony, making every morning special. The staff treated us like family, helpful, and always available when needed. The food was delicious with plenty of options for every guest. The rooms were clean, spacious, and comfortable. The peaceful atmosphere and beautiful surroundings with apple trees and mountain views made our trip memorable. Saloni and Gaz made my trip very memorable. Can't wait to go and meet them again and make some good memories with the family. Highly recommended for families looking for a relaxing stay in Manali!`,
  },
  {
    name: 'Rishav Shrivastava', date: 'May 2026', rating: 5, source: 'google', tripType: 'Holiday · Family',
    text: `Sabdo me bayan nahi kiya jaa sakta for sure. Kisi aur ka to nahi janta but mera Manali me ab khud ka ghar hai and it's HOGS. The owner and staff here are so nice and helpful that I have never met such people in my travels before. I have been to Manali 10 times, but I haven't found the same peace and views anywhere else to date. I have made this place my own, and I promise that I will always stay here now. The rooms are so beautiful that as soon as you draw the curtains, you behold heaven.`,
  },
  {
    name: 'Bhaskar Bhatt', date: 'April 2026', rating: 5, source: 'google',
    text: `Stayed at HOGS – Panorama, and honestly, it exceeded every expectation. From the moment you arrive, you're greeted with uninterrupted panoramic mountain views and a rare kind of peacefulness that's hard to find in Manali. The rooms strike the perfect balance between comfort and aesthetics—beautifully designed, thoughtfully equipped, and incredibly cozy. Every detail feels intentional, making the stay both relaxing and memorable. What truly sets this place apart is the hospitality. The hosts go above and beyond to make you feel at home—warm, attentive, and genuinely caring in a way that elevates the entire experience. And then there's DO NTHNG, their in-house café—an absolute vibe. Exceptional coffee, laid-back energy, and evenings that feel straight out of a travel dream. If you're looking for more than just a stay—something peaceful, aesthetic, and genuinely special—HOGS is it. Perfect for couples, creators, or anyone wanting to slow down and soak in the mountains. Already planning my next visit.`,
  },
  {
    name: 'Nihal Mathur', date: 'October 2026', rating: 5, source: 'google',
    text: `Amazing experience I had with them, very friendly staff, all are so well behaved and professional and I love the energy and the vibe overall. This place is very peaceful with lovely views, the rooms are super cozy with balcony and neat and clean. Best part is the food you'll get at the hotel — you don't have to go out cafe hopping coz you'll see that inside your hotel itself.`,
  },
  {
    name: 'Shresth Agrawal', date: 'July 2026', rating: 5, source: 'google',
    text: `My stay at HOGS Panorama Manali was honestly one of the most memorable travel experiences I've had in a long time. From the moment I arrived, the warmth and hospitality of the entire team made me feel less like a guest and more like family. The property is beautifully located with breathtaking mountain views that you can wake up to every morning. There's something incredibly peaceful about sitting with a cup of tea, looking out at the hills, and simply soaking in the calm atmosphere. The rooms were clean, cozy, well-maintained, and thoughtfully designed to make the stay comfortable. Every little detail reflected the care and effort the team puts into creating a welcoming environment. What truly sets HOGS apart is the people. The staff members were always smiling, helpful, and genuinely concerned about making our stay special. Whether it was helping with local recommendations, arranging things at short notice, or simply checking if everything was comfortable, they went above and beyond at every step. The property has a beautiful vibe that perfectly complements the charm of Manali. It's the kind of place where you can disconnect from the chaos of everyday life and reconnect with yourself, nature, and the people around you. Thank you, Team HOGS, for creating such a warm and memorable experience. The beautiful views, peaceful surroundings, excellent hospitality, delicious food, and genuine care made this trip truly special. I'm leaving with wonderful memories and a strong desire to come back again. Highly recommended!`,
  },
  {
    name: 'Vinayak Agarwal', date: 'May 2026', rating: 5, source: 'google', tripType: 'Holiday · Friends',
    text: `Had a wonderful stay at HOGS Panorama, Manali! 🏔️✨ The views are absolutely breathtaking and the property has such a peaceful, cozy vibe—it truly feels like a home in the mountains. The rooms are beautifully done and very comfortable, making the whole experience even more special. A special mention to the hosts, Gaz and Saloni—warm, welcoming, and always going the extra mile to make sure everything is perfect. The staff is equally kind and attentive, which really adds to the overall experience. Also loved their in-house café, DO NTHNG ☕ Great coffee, amazing food, and the perfect place to just sit, relax, and soak in the views. Highly recommend this place if you're looking for a calm, aesthetic stay in Manali. Can't wait to visit again! 🤍`,
  },
];

export const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
