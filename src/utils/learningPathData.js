// Learning Path Data Utility
// This file contains the actual module data from the learning path files

export const getLearningPathModules = () => {
  return {
    'Beginner': [
      {
        id: 'plant-basics',
        title: 'Plant Fundamentals - Understanding Your Green Friends',
        difficulty: 'Beginner',
        estimatedTime: '30 min',
        description: 'Master the essential knowledge about plant types, life cycles, and basic plant care for successful gardening',
        lessons: [
          {
            id: 1,
            title: 'Plant Types & Life Cycles - The Foundation of Gardening',
            content: 'Understanding plant life cycles is crucial for planning your garden and knowing what to expect from each plant. Plants are categorized into three main types based on their life cycle. This knowledge helps you plan your garden, understand care requirements, and set realistic expectations for your plants.',
            points: [
              '🌱 ANNUALS: Complete their entire life cycle in one growing season. They grow, flower, produce seeds, and die all within a year. Examples: Marigolds, lettuce, petunias, zinnias. Perfect for beginners because you get quick results and can start fresh each year. Care tip: Water regularly during hot weather, deadhead flowers to encourage more blooms, and fertilize monthly for best results.',
              '🌿 PERENNIALS: Live for multiple years, often coming back stronger each season. They may die back in winter but regrow from their roots. Examples: Roses, hostas, lavender, mint, daylilies. Great investment plants that provide long-term garden structure. Care tip: Mulch around perennials in fall to protect roots, divide every 3-4 years to maintain vigor, and prune dead growth in spring.',
              '🌾 BIENNIALS: Take exactly two years to complete their cycle. First year: grow leaves and roots. Second year: flower, produce seeds, then die. Examples: Carrots, parsley, foxgloves, hollyhocks. Require patience but offer unique growing experiences. Care tip: Mark biennials clearly so you don\'t accidentally pull them in their first year, and allow them to complete their cycle.',
              '💡 PLANNING TIP: Mix all three types in your garden! Annuals for quick color, perennials for structure, and biennials for variety. This creates a dynamic, ever-changing garden that stays interesting year-round. Plan your garden layout considering each plant\'s life cycle and space needs.',
              '🔬 PLANT ANATOMY: Understanding basic plant parts helps you care for them better. Roots absorb water and nutrients from soil - keep soil healthy! Stems transport water and nutrients - support tall plants with stakes. Leaves make food through photosynthesis - keep them clean and healthy. Flowers are for reproduction - deadhead to encourage more blooms. Fruits/seeds are plant babies - harvest when mature.',
              '🌱 GROWTH PATTERNS: Plants grow in two ways - primary growth (getting taller) and secondary growth (getting wider). Understanding this helps you know when and how to prune or support your plants. Prune during active growth periods, support plants before they get too tall, and understand that different plants have different growth rates.'
            ]
          },
          {
            id: 2,
            title: 'Essential Plant Care - Water, Light, and Temperature',
            content: 'The three most critical factors for plant health are water, light, and temperature. Master these basics, and your plants will thrive. Each plant has specific needs, but understanding the fundamentals applies to all plants.',
            points: [
              '💧 WATERING BASICS: Most plants prefer deep, infrequent watering rather than frequent shallow watering. Check soil moisture by sticking your finger 1-2 inches into the soil - if it\'s dry, water thoroughly. Water in the morning to allow leaves to dry before evening. Signs of overwatering: yellow leaves, mushy stems, mold on soil. Signs of underwatering: drooping leaves, dry crispy edges, soil pulling away from pot edges.',
              '☀️ LIGHT REQUIREMENTS: Plants need different amounts of light. Full sun (6+ hours direct sunlight) - tomatoes, peppers, most vegetables. Partial sun (3-6 hours) - many herbs, leafy greens. Shade (less than 3 hours) - ferns, hostas, some houseplants. Observe your space throughout the day to determine light levels. Rotate indoor plants weekly for even growth.',
              '🌡️ TEMPERATURE CONSIDERATIONS: Most plants prefer temperatures between 65-75°F (18-24°C). Avoid placing plants near heating vents, air conditioners, or drafty windows. Protect outdoor plants from frost - cover or bring indoors when temperatures drop below 50°F (10°C). Some plants need a dormant period with cooler temperatures.',
              '🌱 PLANT POSITIONING: Place plants where they\'ll receive appropriate light. South-facing windows get the most light, north-facing get the least. East-facing get morning sun (gentle), west-facing get afternoon sun (intense). Group plants with similar needs together for easier care. Use curtains or blinds to filter intense sunlight if needed.',
              '💡 CARE SCHEDULE: Establish a weekly routine: Monday - check all plants, Wednesday - water as needed, Friday - inspect for pests/problems, Sunday - fertilize if needed. Consistency is key - plants thrive on routine. Keep a simple journal to track what works for each plant.',
              '🔍 READING PLANT SIGNALS: Yellow leaves can mean overwatering, underwatering, or nutrient deficiency. Drooping leaves usually mean water stress. Brown crispy edges often mean low humidity or underwatering. New growth is a good sign - your plant is happy! Learn to observe and respond to your plant\'s needs.'
            ]
          },
          {
            id: 3,
            title: 'Daily Plant Care Routine - Building Healthy Habits',
            content: 'The key to gardening success is building confidence through small wins and consistent care. Think of it like learning to cook - you don\'t start with a five-course meal! Here\'s your step-by-step approach to daily plant care.',
            points: [
              '🎯 THE 3-5 PLANT RULE: Begin with maximum 3-5 plants. This allows you to give each plant individual attention and learn their specific needs. More plants = more complexity = higher chance of failure. Quality over quantity! Choose plants with different care needs to learn variety, but start simple.',
              '📅 DAILY CARE ROUTINE: Establish a simple routine: Morning check (2-3 minutes) - look for changes, check soil moisture, observe new growth. Water when needed - don\'t water on a schedule, water when plants need it. Evening check - see how plants responded to the day. Consistency is more important than perfection. Plants thrive on routine, just like pets.',
              '💧 WATERING TECHNIQUES: Water at the base of plants, not on leaves (prevents disease). Water until it drains from bottom of pot, then empty saucer after 30 minutes. For outdoor plants, water deeply 2-3 times per week rather than daily shallow watering. Use room temperature water - cold water can shock roots. Water less in winter when plants grow slower.',
              '🌿 FEEDING YOUR PLANTS: Fertilize during growing season (spring/summer) every 2-4 weeks. Use balanced fertilizer (10-10-10) for most plants. Reduce or stop fertilizing in fall/winter. Always follow package directions - more is not better! Over-fertilizing can burn roots and damage plants. Organic options like compost tea are gentler.',
              '🔍 OBSERVATION SKILLS: Learn to "read" your plants. Yellow leaves, drooping, new growth - these are your plants\' way of communicating. Check leaves (top and bottom) for pests. Look at soil surface for mold or pests. Observe growth patterns - is it growing normally? The more you observe, the better gardener you become.',
              '💡 CONFIDENCE BUILDING: Celebrate small wins! First new leaf, first flower, first harvest. These moments build the confidence you need to tackle more challenging plants later. Take photos to track progress. Share successes with other gardeners. Remember - every expert was once a beginner!'
            ]
          }
        ],
        quiz: {
          title: 'Plant Fundamentals Quiz',
          questions: [
            {
              id: 1,
              question: 'Based on the lesson about plant types, which type of plant completes its entire life cycle in one growing season?',
              options: ['Perennial (lives many years)', 'Annual (lives one season)', 'Biennial (lives two years)', 'Evergreen (lives forever)'],
              correct: 1,
              explanation: '✅ CORRECT! Annuals complete their entire life cycle in one growing season - they grow, flower, produce seeds, and die all within a year. Examples include marigolds, lettuce, and petunias. They\'re perfect for beginners because you get quick results!'
            },
            {
              id: 2,
              question: 'According to the watering basics lesson, what is the best way to check if a plant needs water?',
              options: ['Water on a fixed schedule every day', 'Stick your finger 1-2 inches into the soil to check moisture', 'Water whenever you remember', 'Only water when leaves are drooping'],
              correct: 1,
              explanation: '✅ CORRECT! The best way to check soil moisture is to stick your finger 1-2 inches into the soil. If it feels dry, water thoroughly. Most plants prefer deep, infrequent watering rather than frequent shallow watering. Watering on a schedule can lead to overwatering!'
            },
            {
              id: 3,
              question: 'From the daily care routine lesson, what is the recommended number of plants a beginner should start with?',
              options: ['10-15 plants', '3-5 plants', '20+ plants', 'Just one plant'],
              correct: 1,
              explanation: '✅ CORRECT! The 3-5 plant rule is ideal for beginners. This allows you to give each plant individual attention, learn their specific needs, and build confidence. More plants mean more complexity and a higher chance of failure. Quality over quantity when learning!'
            },
            {
              id: 4,
              question: 'Based on the light requirements lesson, how many hours of direct sunlight do "full sun" plants need?',
              options: ['1-2 hours', '3-5 hours', '6+ hours of direct sunlight', 'No direct sunlight needed'],
              correct: 2,
              explanation: '✅ CORRECT! Full sun plants need 6 or more hours of direct sunlight per day. Examples include tomatoes, peppers, and most vegetables. Partial sun plants need 3-6 hours, and shade plants need less than 3 hours of direct sunlight.'
            },
            {
              id: 5,
              question: 'According to the plant care routine lesson, when should you fertilize your plants?',
              options: ['Every day', 'Only in winter', 'Every 2-4 weeks during growing season (spring/summer)', 'Never fertilize'],
              correct: 2,
              explanation: '✅ CORRECT! Fertilize during the growing season (spring/summer) every 2-4 weeks. Use balanced fertilizer (10-10-10) for most plants. Reduce or stop fertilizing in fall/winter when plants grow slower. Always follow package directions - more is not better!'
            }
          ]
        }
      },
      {
        id: 'soil-fundamentals',
        title: 'Soil Fundamentals - The Foundation of Plant Health',
        difficulty: 'Beginner',
        estimatedTime: '35 min',
        description: 'Master the basics of soil types, composition, and how to create the perfect growing environment for your plants',
        lessons: [
          {
            id: 4,
            title: 'Understanding Soil Types - Your Plant\'s Home',
            content: 'Soil is more than just dirt - it\'s your plant\'s home, providing nutrients, water, air, and support. Understanding soil types is crucial for plant success. Different plants need different soil conditions, and choosing the right soil is one of the most important decisions you\'ll make as a gardener.',
            points: [
              '🏠 POTTING MIX vs GARDEN SOIL: Potting mix is specially formulated for containers - lightweight, well-draining, and sterile. Garden soil is too heavy and dense for pots, leading to poor drainage and root rot. Always use potting mix for container plants. Never use garden soil in pots - it compacts and suffocates roots. Potting mix contains ingredients like peat moss, perlite, and compost that create the perfect environment for container plants.',
              '💧 DRAINAGE IS CRITICAL: Good soil should drain water quickly while retaining some moisture. Look for mixes with perlite (white specks that improve drainage), vermiculite (holds water), or sand. Poor drainage = waterlogged roots = plant death. Your plant\'s roots need air as much as water! Test drainage by watering and watching how quickly water flows through. If water sits on top for more than a few seconds, the soil needs better drainage.',
              '🌱 SOIL TEXTURE TYPES: Clay soil (heavy, sticky, holds water too long), Sandy soil (light, gritty, drains too quickly), Loamy soil (perfect balance - dark, crumbly, ideal for most plants). Most garden plants prefer loamy soil. You can improve any soil type by adding organic matter like compost.',
              '🔬 SOIL COMPONENTS EXPLAINED: Peat moss (retains moisture, slightly acidic), Perlite (white volcanic rock, improves drainage and aeration), Vermiculite (expanded mica, holds water and nutrients), Compost (adds nutrients and beneficial microbes, improves structure). The best mixes contain a balance of these components. Each component serves a specific purpose in creating healthy soil.',
              '📊 pH LEVELS MATTER: Most plants prefer slightly acidic soil (pH 6.0-7.0). Some plants like blueberries need very acidic soil (pH 4.5-5.5). Test your soil pH if plants show nutrient deficiency symptoms. You can buy pH test kits at garden centers. Adjust pH with lime (raises pH) or sulfur (lowers pH) if needed, but most potting mixes are already balanced.',
              '💡 SOIL SELECTION TIP: When in doubt, choose a premium potting mix. It costs more upfront but saves money in the long run by preventing plant problems and ensuring healthy growth. Look for mixes labeled "all-purpose" or "for containers." Avoid the cheapest options - they often lack proper drainage and nutrients.'
            ]
          },
          {
            id: 5,
            title: 'Soil Preparation & Container Selection',
            content: 'The right container and proper soil preparation make all the difference in plant health and growth. Setting up your plants correctly from the start prevents many problems later. Learn how to choose containers and prepare soil for optimal plant health.',
            points: [
              '🪴 CONTAINER ESSENTIALS: Ensure drainage holes in all containers - this is non-negotiable! If a container doesn\'t have holes, drill them or use it as a decorative outer pot only. Add saucers indoors to catch excess water. Choose appropriate size for plant growth - too small restricts roots, too large holds too much water and can cause root rot. A good rule: container should be 1-2 inches larger in diameter than the root ball.',
              '📏 SIZE MATTERS: Start with containers 2-4 inches larger than the plant\'s root ball. Most plants need to be repotted every 1-2 years as they grow. Watch for signs you need to repot: roots coming out of drainage holes, plant dries out very quickly, plant stops growing, or roots are visible on soil surface. When repotting, only go up one size - too large a jump can cause problems.',
              '🏺 MATERIAL CHOICES: Clay pots (breathable, good drainage, but heavy and breakable), Plastic pots (lightweight, retain moisture longer, affordable, but less breathable), Ceramic pots (attractive, good drainage if they have holes, but fragile and expensive). Choose based on your plant\'s needs and your preferences. For moisture-loving plants, use plastic. For plants that need to dry out, use clay.',
              '🌱 SOIL PREPARATION STEPS: Moisten potting mix before planting - dry soil repels water and can cause dry pockets. Fill container 1/3 full with moistened soil. Place plant in center, making sure it sits at the same depth as before. Fill around roots with more soil, firm gently (don\'t pack too tightly). Leave 1 inch space at top for watering. Water thoroughly after planting to settle soil and remove air pockets.',
              '🔄 REPOTTING BASICS: Repot when plant outgrows container or soil is exhausted (usually every 1-2 years). Gently remove plant from old pot - tap sides if stuck. Loosen root ball slightly if roots are tightly wound. Place in new pot with fresh soil. Water well and place in appropriate light. Don\'t fertilize for 2-3 weeks after repotting - let roots settle first. Best time to repot is spring when plants start growing.',
              '💧 WATERING SETUP: Use saucers to catch excess water, but empty them after 30 minutes to prevent root rot. Never let plants sit in standing water. Group plants with similar water needs together for easier care. Consider using a watering tray with pebbles and water for plants that need high humidity - this creates moisture without waterlogging roots.'
            ]
          },
          {
            id: 6,
            title: 'Soil Amendments & Plant Nutrition',
            content: 'Learn how to improve your soil and provide proper nutrition for healthy plant growth. Understanding fertilizers and soil amendments helps you give your plants exactly what they need to thrive.',
            points: [
              '🌿 ORGANIC AMENDMENTS: Compost (adds nutrients and improves structure, feeds beneficial microbes), Worm castings (rich in nutrients, great for seedlings, gentle fertilizer), Leaf mold (improves water retention, adds organic matter), Manure (high in nitrogen, must be well-aged or it burns plants). These feed both plants and beneficial soil organisms. Organic amendments improve soil structure over time, making your soil better each year.',
              '⚡ INORGANIC AMENDMENTS: Perlite (white volcanic rock, improves drainage and aeration, doesn\'t break down), Vermiculite (expanded mica, holds water and nutrients, good for seed starting), Sand (improves drainage in clay soils, use coarse sand not fine), Lime (raises pH for alkaline-loving plants, use carefully). These improve soil structure and drainage but don\'t add nutrients. Mix these into soil before planting for best results.',
              '🍃 FERTILIZER BASICS - THE NPK SYSTEM: Plants need three main nutrients - Nitrogen (N) for green leafy growth, Phosphorus (P) for roots and flowers, Potassium (K) for overall health and disease resistance. Look for balanced fertilizers like 10-10-10 for general use. The numbers represent percentage of each nutrient. For example, 10-10-10 means 10% nitrogen, 10% phosphorus, 10% potassium. Higher numbers mean more concentrated fertilizer.',
              '⏰ FERTILIZING SCHEDULE: Most houseplants need fertilizing every 2-4 weeks during growing season (spring/summer). Reduce or stop in fall/winter when plants grow slower. Always follow package directions - more is not better! Over-fertilizing can burn roots and damage plants. Signs of over-fertilizing: brown leaf tips, white crust on soil, stunted growth. If you see these, flush soil with water to remove excess fertilizer.',
              '🌱 ORGANIC VS SYNTHETIC FERTILIZERS: Organic fertilizers (compost, fish emulsion, bone meal) feed soil life and release nutrients slowly over time. They improve soil structure and are gentler on plants. Synthetic fertilizers (Miracle-Gro, chemical NPK) provide quick nutrients but don\'t improve soil structure. Both have their place in gardening. Many gardeners use organic for long-term health and synthetic for quick fixes.',
              '💡 NUTRIENT DEFICIENCY SIGNS: Yellow leaves (especially older leaves) = nitrogen deficiency - add nitrogen-rich fertilizer. Purple or reddish leaves = phosphorus deficiency - add phosphorus fertilizer. Brown leaf edges or spots = potassium deficiency - add potassium. Yellowing between veins = iron deficiency - often caused by high pH. Learn to read these signs to provide targeted nutrition. Fix deficiencies gradually - don\'t overcorrect!'
            ]
          }
        ],
        quiz: {
          title: 'Soil Fundamentals Quiz',
          questions: [
            {
              id: 4,
              question: 'According to the soil types lesson, what should you always use for container plants instead of garden soil?',
              options: ['Garden soil (it\'s natural)', 'Potting mix (specially formulated for containers)', 'Sand only', 'Clay soil'],
              correct: 1,
              explanation: '✅ CORRECT! Always use potting mix for container plants. Potting mix is lightweight, well-draining, and sterile, while garden soil is too heavy and dense for pots, leading to poor drainage and root rot. Potting mix contains ingredients like peat moss, perlite, and compost that create the perfect environment for container plants.'
            },
            {
              id: 5,
              question: 'Based on the container selection lesson, what is the most important feature a plant container must have?',
              options: ['Attractive color', 'Drainage holes', 'Large size', 'Expensive material'],
              correct: 1,
              explanation: '✅ CORRECT! Drainage holes are absolutely essential and non-negotiable! Without them, water accumulates at the bottom, causing root rot and plant death. Even the most beautiful container is useless without proper drainage. If a container doesn\'t have holes, drill them or use it as a decorative outer pot only.'
            },
            {
              id: 6,
              question: 'From the fertilizer basics lesson, what do the numbers 10-10-10 on a fertilizer package represent?',
              options: ['Price in dollars', 'NPK ratio (Nitrogen-Phosphorus-Potassium)', 'Weight in pounds', 'Expiration date'],
              correct: 1,
              explanation: '✅ CORRECT! The numbers 10-10-10 represent the NPK ratio - 10% Nitrogen (for green growth), 10% Phosphorus (for roots and flowers), 10% Potassium (for overall health). This is a balanced fertilizer suitable for most plants during their growing season. The numbers represent the percentage of each nutrient in the fertilizer.'
            },
            {
              id: 7,
              question: 'According to the soil preparation lesson, how much space should you leave at the top of a container when planting?',
              options: ['Fill to the very top', 'Leave 1 inch space at top for watering', 'Leave 3 inches space', 'It doesn\'t matter'],
              correct: 1,
              explanation: '✅ CORRECT! Leave 1 inch space at the top for watering. This space allows you to water thoroughly without water spilling over the edges. When preparing soil, fill container 1/3 full, place plant, fill around roots, firm gently, and leave that important 1 inch space at the top.'
            },
            {
              id: 8,
              question: 'Based on the nutrient deficiency signs lesson, what does yellow leaves (especially older leaves) typically indicate?',
              options: ['Phosphorus deficiency', 'Nitrogen deficiency', 'Potassium deficiency', 'Too much water'],
              correct: 1,
              explanation: '✅ CORRECT! Yellow leaves, especially on older leaves, typically indicate a nitrogen deficiency. Nitrogen is essential for green leafy growth. Other signs: Purple or reddish leaves = phosphorus deficiency, Brown leaf edges = potassium deficiency. Learn to read these signs to provide targeted nutrition!'
            }
          ]
        }
      },
      {
        id: 'plant-soil-relationships',
        title: 'Plant-Soil Relationships - Perfect Matches',
        difficulty: 'Beginner',
        estimatedTime: '40 min',
        description: 'Learn how different plants thrive in different soil conditions and how to match plants with their ideal soil environment',
        lessons: [
          {
            id: 7,
            title: 'Understanding Plant-Soil Compatibility',
            content: 'Different plants have evolved to thrive in different soil conditions. Understanding these relationships is key to gardening success. Matching plants to their preferred soil type makes gardening easier and more successful. Learn which plants work best in different soil conditions.',
            points: [
              '🌱 CLAY SOIL PLANTS: Clay soil is heavy, sticky, and holds water well but drains slowly. Plants that thrive: Hostas (large leaves love constant moisture), Daylilies (tough roots handle heavy, compacted soil), Astilbe (feathery flowers need constant moisture), Japanese Iris (loves wet feet and heavy soil). These plants have adapted to slow-draining conditions. If you have clay soil, these are your best choices!',
              '🌱 SANDY SOIL PLANTS: Sandy soil is light, gritty, and drains very quickly. Plants that thrive: Lavender (silver leaves reflect sun, deep roots find water), Rosemary (Mediterranean native, drought-adapted), Succulents (store water in leaves, need quick drainage), Cacti (spines reduce water loss, evolved for dry conditions). These plants evolved for quick drainage and can\'t handle wet feet. Perfect for sandy soil!',
              '🌱 LOAMY SOIL PLANTS: Loamy soil is the "goldilocks" - perfect balance of sand, silt, and clay. Most garden favorites prefer this: Tomatoes (need steady moisture and nutrients), Roses (require good drainage but consistent water), Lettuce (quick-growing, needs balanced conditions), Carrots (need loose soil for straight roots). If you have loamy soil, you can grow almost anything!',
              '🌱 ACIDIC SOIL PLANTS: Some plants need acidic soil (pH below 6.0): Azaleas (shallow roots need acidic conditions), Blueberries (require pH 4.5-5.5 for iron absorption), Rhododendrons (large leaves need acidic soil), Camellias (evergreen beauty in acidic conditions). These plants evolved in forest floors with acidic, organic-rich soil. Test your pH before planting these!',
              '🔍 SOIL IDENTIFICATION TECHNIQUES: Clay soil (dark, sticky when wet, forms hard clumps, drains slowly), Sandy soil (light brown/tan, gritty texture, drains very quickly, feels loose), Loamy soil (dark brown, crumbly texture, balanced drainage, ideal for most plants), Peaty soil (very dark, spongy texture, acidic, holds lots of water). Learn to identify by sight, touch, and the squeeze test.',
              '💡 MATCHING STRATEGY: Choose plants that naturally thrive in your soil type - this reduces maintenance and increases success. Or modify your soil to suit your desired plants - add compost to improve any soil, add sand to improve clay drainage, add organic matter to improve sandy soil. It\'s easier to work with nature than against it! Research plant preferences before buying.'
            ]
          },
          {
            id: 8,
            title: 'Soil Testing & Improvement Techniques',
            content: 'Learn simple techniques to test your soil and improve it for better plant health. Testing your soil helps you understand what you\'re working with and what improvements are needed. These simple tests can be done at home with no special equipment.',
            points: [
              '🧪 SIMPLE SOIL TESTS YOU CAN DO: The squeeze test - take moist soil, squeeze it. Clay forms a tight ball that stays together, sandy crumbles apart immediately, loamy forms a ball but breaks when poked. The drainage test - dig a 12-inch hole, fill with water, time how long it takes to drain. Good drainage = 1-3 hours. The jar test - put soil in jar with water, shake, let settle. Layers show soil composition (clay on top, sand on bottom). These help identify your soil type.',
              '📊 pH TESTING METHODS: Use pH test strips (available at garden centers, quick and easy), or send samples to extension services (most accurate, provides detailed analysis). Most plants prefer pH 6.0-7.0 (slightly acidic to neutral). Acidic soil (below 6.0) is good for blueberries, azaleas, rhododendrons. Alkaline soil (above 7.0) is good for lavender, clematis, some vegetables. Test pH before planting acid-loving plants!',
              '🌿 SOIL IMPROVEMENT TECHNIQUES: Add compost to all soils (improves structure and nutrients, feeds beneficial microbes), Add sand to clay (improves drainage, use coarse sand not fine), Add organic matter to sand (improves water retention, use compost or peat moss), Add lime to acidic soil (raises pH, use carefully and test results), Add sulfur to alkaline soil (lowers pH, use carefully). Start with small amounts and test results - don\'t over-amend!',
              '⏰ TIMING MATTERS: Test soil in spring before planting season. Add amendments 2-4 weeks before planting to allow them to integrate into soil. Don\'t over-amend - start with small amounts (1-2 inches of compost), test results, then add more if needed. Over-amending can cause problems just like under-amending. Patience is key - soil improvement takes time.',
              '🔄 LONG-TERM IMPROVEMENT STRATEGIES: Regular addition of compost improves any soil over time - add 1-2 inches each year. Cover crops (like clover or rye) add organic matter and nutrients when turned under. Mulching protects soil, retains moisture, and adds organic matter as it decomposes. These practices build soil health gradually and sustainably.',
              '💧 WATERING ADJUSTMENTS BY SOIL TYPE: Clay soil needs less frequent, deeper watering (water deeply once a week rather than daily). Sandy soil needs more frequent, lighter watering (may need water every 2-3 days, but less each time). Loamy soil needs moderate, regular watering (2-3 times per week, moderate amounts). Adjust your watering schedule to your soil type for best results. Observe how quickly your soil dries out and adjust accordingly.'
            ]
          },
          {
            id: 9,
            title: 'Creating the Perfect Growing Environment',
            content: 'Combine your knowledge of plants and soil to create optimal growing conditions. This is where everything comes together - matching the right plants to the right soil, preparing soil properly, and maintaining the perfect environment for your plants to thrive.',
            points: [
              '🎯 PLANT SELECTION STRATEGY: Start with plants that naturally thrive in your soil type - this reduces maintenance and increases success. Research plant preferences before buying - check labels, ask at garden centers, read plant descriptions. It saves time and money to choose the right plants from the start. If you want specific plants, be prepared to modify your soil to meet their needs.',
              '🌱 CONTAINER GARDENING ADVANTAGES: Use different soil mixes for different plants in containers - this gives you complete control! Cacti and succulents need sandy, well-draining mix (add extra perlite). Ferns and moisture-lovers need moisture-retentive mix (add extra peat moss). Herbs need well-drained mix (standard potting mix works). You can create the perfect soil for each plant type in containers.',
              '🌱 OUTDOOR CONTAINER SETUP: Most outdoor container plants prefer well-draining potting mix. Add extra perlite for succulents and drought-tolerant plants. Add extra peat moss for moisture-loving plants. Ensure proper drainage for outdoor containers - they need drainage holes and should be elevated slightly so water can drain freely. Use quality potting mix - don\'t skimp on soil quality.',
              '🌿 GARDEN BED PREPARATION: Test soil before planting new beds - know what you\'re working with. Add amendments based on test results and plant needs. Create raised beds for better drainage if your native soil is heavy clay. Plan plant placement based on soil conditions - group plants with similar needs together. Prepare beds 2-4 weeks before planting to allow amendments to integrate.',
              '💡 SUCCESS TIPS FOR PLANT-SOIL MATCHING: Group plants with similar soil needs together - this makes watering and fertilizing easier. Keep records of what works in your soil - note which plants thrive and which struggle. This knowledge is valuable for future plantings. Don\'t be afraid to move plants if they\'re not happy - sometimes a different location makes all the difference.',
              '🔄 CONTINUOUS LEARNING AND ADAPTATION: Observe how plants respond to your soil conditions - they\'ll tell you if they\'re happy! Some plants may surprise you by thriving in unexpected conditions. Gardening is about learning and adapting to your unique environment. Don\'t give up if something doesn\'t work - try a different plant or improve your soil. Every garden is a learning experience!'
            ]
          }
        ],
        quiz: {
          title: 'Plant-Soil Relationships Quiz',
          questions: [
            {
              id: 7,
              question: 'According to the plant-soil compatibility lesson, which type of plants thrive in sandy soil that drains quickly?',
              options: ['Hostas and daylilies (need constant moisture)', 'Lavender and rosemary (drought-adapted)', 'Azaleas and blueberries (need acidic soil)', 'All plants work in sandy soil'],
              correct: 1,
              explanation: '✅ CORRECT! Lavender and rosemary are perfect for sandy soil. Sandy soil drains very quickly, and these Mediterranean plants have evolved to handle dry, well-drained conditions. They have deep roots that find water and leaves adapted to conserve moisture. Plants that need constant moisture would struggle in sandy soil.'
            },
            {
              id: 8,
              question: 'Based on the soil testing lesson, what does the squeeze test tell you? If soil forms a ball but breaks when poked, what type of soil is it?',
              options: ['Clay soil (stays in tight ball)', 'Sandy soil (crumbles apart)', 'Loamy soil (ball breaks when poked)', 'Peaty soil (spongy)'],
              correct: 2,
              explanation: '✅ CORRECT! If soil forms a ball but breaks when poked, it\'s loamy soil - the "goldilocks" of soils! This is the perfect balance of sand, silt, and clay. Clay soil would stay in a tight ball, sandy soil would crumble apart immediately, and peaty soil would feel spongy. Loamy soil is ideal for most garden plants.'
            },
            {
              id: 9,
              question: 'From the soil improvement lesson, what should you add to clay soil to improve drainage?',
              options: ['More clay', 'Sand (coarse sand, not fine)', 'Only water', 'Nothing - clay is perfect'],
              correct: 1,
              explanation: '✅ CORRECT! Add coarse sand to clay soil to improve drainage. Sand creates air spaces in heavy clay soil, allowing water to drain better. Use coarse sand, not fine sand. You can also add compost to improve structure. Clay soil that doesn\'t drain well can cause root rot, so improving drainage is important.'
            },
            {
              id: 10,
              question: 'According to the growing environment lesson, what is an advantage of container gardening?',
              options: ['You can\'t control soil conditions', 'You can use different soil mixes for different plants', 'Containers are always better than garden beds', 'Plants grow faster in containers'],
              correct: 1,
              explanation: '✅ CORRECT! Container gardening gives you complete control - you can use different soil mixes for different plants! Cacti get sandy mix, ferns get moisture-retentive mix, herbs get well-drained mix. This allows you to create the perfect soil for each plant type, regardless of your native soil conditions.'
            },
            {
              id: 11,
              question: 'Based on the watering adjustments lesson, how should you water clay soil?',
              options: ['Water daily with small amounts', 'Water less frequently but deeply (once a week)', 'Water only in summer', 'Clay soil doesn\'t need water'],
              correct: 1,
              explanation: '✅ CORRECT! Clay soil needs less frequent, deeper watering - water deeply once a week rather than daily. Clay holds water well, so it doesn\'t need frequent watering. Deep watering encourages roots to grow deep, while frequent shallow watering keeps roots near the surface. Adjust your watering schedule to your soil type!'
            }
          ]
        }
      }
    ],
    'Intermediate': [
      {
        id: 'advanced-plant-nutrition',
        title: 'Advanced Plant Nutrition - The Science of Feeding',
        difficulty: 'Intermediate',
        estimatedTime: '45 min',
        description: 'Master the science of plant nutrition, nutrient cycling, and advanced fertilizing strategies for optimal plant health and productivity',
        lessons: [
          {
            id: 10,
            title: 'Understanding Plant Nutrients - The Building Blocks of Growth',
            content: 'Plants are like athletes - they need the right nutrients in the right amounts to perform at their best. Understanding plant nutrition is key to growing healthy, productive plants:',
            points: [
              '🌿 NITROGEN (N) - The Growth Engine: Essential for leaf and stem growth, makes leaves green and lush. Deficiency signs: Yellow leaves, stunted growth. Excess signs: Dark green leaves, weak stems. Best for: Leafy vegetables, lawns, foliage plants.',
              '🌸 PHOSPHORUS (P) - The Root & Flower Power: Critical for root development, flowering, and fruiting. Deficiency signs: Purple leaves, poor flowering, weak roots. Excess signs: Can block other nutrients. Best for: Flowering plants, root vegetables, young plants.',
              '💪 POTASSIUM (K) - The Disease Fighter: Strengthens plants against diseases, improves fruit quality, helps with water regulation. Deficiency signs: Brown leaf edges, weak stems, poor fruit quality. Best for: Fruit trees, tomatoes, peppers.',
              '🔬 SECONDARY NUTRIENTS: Calcium (strong cell walls), Magnesium (chlorophyll production), Sulfur (protein synthesis). These are needed in smaller amounts but are still essential for plant health.',
              '⚡ MICRONUTRIENTS: Iron, zinc, copper, manganese, boron, molybdenum. Needed in tiny amounts but crucial for specific plant functions. Deficiency can cause specific symptoms like yellowing between leaf veins.',
              '📊 NUTRIENT BALANCE: The key is balance - too much of one nutrient can block others. Use balanced fertilizers (like 10-10-10) unless you have specific needs. Test your soil to know what your plants actually need.'
            ]
          },
          {
            id: 11,
            title: 'Advanced Fertilizing Strategies - Precision Nutrition',
            content: 'Different plants need different types of nutrition, and different situations call for different approaches. Here\'s your guide to advanced plant food options:',
            points: [
              '💧 LIQUID FERTILIZERS: Fast-acting, easy to apply, great for container plants and quick fixes. Examples: Fish emulsion, seaweed extract, water-soluble powders. Best for: Houseplants, seedlings, plants needing quick nutrition boost.',
              '🌱 GRANULAR FERTILIZERS: Slow-release, long-lasting, great for garden beds and established plants. Examples: Pelleted fertilizers, time-release capsules. Best for: Garden beds, trees, shrubs, long-term feeding.',
              '🌿 ORGANIC OPTIONS: Natural, improve soil structure, feed beneficial microbes. Examples: Compost, manure, bone meal, blood meal. Best for: Long-term soil health, organic gardening, improving soil structure.',
              '⚡ SYNTHETIC FERTILIZERS: Precise, fast-acting, easy to measure. Examples: Miracle-Gro, chemical NPK fertilizers. Best for: Quick results, precise nutrient control, commercial growing.',
              '🔄 COMPOST: The ultimate soil amendment - improves structure, adds nutrients, feeds beneficial microbes. Make your own or buy quality compost. Best for: All plants, soil improvement, sustainable gardening.',
              '📊 FERTILIZER RATIOS: N-P-K numbers tell you the ratio of nutrients. 10-10-10 is balanced, 20-10-10 is high nitrogen (good for leafy growth), 10-20-10 is high phosphorus (good for flowering).'
            ]
          },
          {
            id: 12,
            title: 'Nutrient Cycling & Soil Health - The Big Picture',
            content: 'Fertilizing at the right time and in the right way makes all the difference. Here\'s how to feed your plants effectively while building long-term soil health:',
            points: [
              '⏰ SEASONAL TIMING: Spring (when plants start growing), Summer (during active growth), Fall (for root development), Winter (minimal for most plants). Most plants need more nutrition during active growth periods.',
              '🌱 PLANT LIFE STAGE: Seedlings (light, frequent feeding), Young plants (regular feeding), Mature plants (maintenance feeding), Flowering plants (higher phosphorus before blooming). Adjust nutrition to plant needs.',
              '🌿 SOIL CONDITIONS: Test soil before fertilizing, water before applying fertilizer, avoid fertilizing stressed plants, don\'t fertilize in extreme heat or cold. Healthy soil makes fertilizer more effective.',
              '💧 APPLICATION METHODS: Top-dressing (spreading on soil surface), Side-dressing (placing near plant roots), Foliar feeding (spraying on leaves), Deep feeding (placing fertilizer in root zone). Choose method based on plant and fertilizer type.',
              '📏 DOSAGE CONTROL: More is not better - follow package directions, start with less and increase if needed, watch for signs of over-fertilization (burned leaves, stunted growth). It\'s easier to add more than to fix over-fertilization.',
              '🔄 FEEDING SCHEDULE: Create a regular schedule, adjust based on plant response, keep records of what works, be consistent but flexible. Regular, appropriate feeding is better than occasional heavy feeding.'
            ]
          }
        ],
        quiz: {
          title: 'Advanced Plant Nutrition Quiz',
          questions: [
            {
              id: 10,
              question: '🧪 NUTRIENT DEFICIENCY: This plant shows yellowing between leaf veins while the veins remain green. What nutrient is deficient?',
              image: '/images/quiz/quiz-iron-deficiency.jpg',
              imageDescription: 'Plant leaves showing interveinal chlorosis - yellowing between green veins, typical of iron deficiency',
              options: ['Nitrogen deficiency', 'Iron deficiency', 'Phosphorus deficiency', 'Potassium deficiency'],
              correct: 1,
              explanation: '✅ CORRECT! This is iron deficiency, shown by interveinal chlorosis (yellowing between green veins). Iron is a micronutrient essential for chlorophyll production. This is common in alkaline soils where iron becomes unavailable to plants.'
            },
            {
              id: 11,
              question: '📊 FERTILIZER ANALYSIS: A fertilizer labeled 15-30-15 would be best for which type of plants?',
              options: ['Leafy vegetables (high nitrogen)', 'Flowering plants (high phosphorus)', 'Fruit trees (high potassium)', 'General garden plants (balanced)'],
              correct: 1,
              explanation: '✅ CORRECT! 15-30-15 fertilizer is high in phosphorus (30), which is essential for flowering and fruiting. The high phosphorus content makes it ideal for flowering plants, vegetables that produce fruits, and plants in their blooming phase.'
            },
            {
              id: 12,
              question: '🌱 FERTILIZER TIMING: When is the best time to apply a slow-release fertilizer to established perennials?',
              options: ['Mid-winter', 'Early spring before growth starts', 'Mid-summer during peak growth', 'Late fall after dormancy'],
              correct: 1,
              explanation: '✅ CORRECT! Early spring is the ideal time to apply slow-release fertilizer to perennials. This timing allows the fertilizer to be available just as plants begin their active growth period, providing sustained nutrition throughout the growing season.'
            }
          ]
        }
      },
      {
        id: 'soil-chemistry-plant-health',
        title: 'Soil Chemistry & Plant Health - The Science Connection',
        difficulty: 'Intermediate',
        estimatedTime: '50 min',
        description: 'Deep dive into soil chemistry, nutrient availability, and how soil conditions directly affect plant health and productivity',
        lessons: [
          {
            id: 13,
            title: 'Soil Chemistry - The Hidden World Beneath',
            content: 'Soil is a complex ecosystem with chemical processes that directly affect plant health. Understanding soil chemistry helps you create the perfect growing environment:',
            points: [
              '🧪 pH AND NUTRIENT AVAILABILITY: Most nutrients are available at pH 6.0-7.0. Acidic soil (below 6.0) makes some nutrients unavailable, alkaline soil (above 7.0) makes others unavailable. Adjust pH to optimize nutrient uptake.',
              '⚡ CATION EXCHANGE CAPACITY (CEC): Measures soil\'s ability to hold nutrients. High CEC (clay soils) holds nutrients well but may need more fertilizer. Low CEC (sandy soils) needs frequent, light applications. Test your soil\'s CEC.',
              '🌱 ORGANIC MATTER: Improves soil structure, increases water retention, feeds beneficial microbes, slowly releases nutrients. Aim for 3-5% organic matter in garden soil. Add compost, manure, or other organic materials regularly.',
              '💧 SOIL MOISTURE AND NUTRIENTS: Water carries nutrients to plant roots. Too much water leaches nutrients away. Too little water prevents nutrient uptake. Maintain consistent moisture for optimal nutrition.',
              '🦠 MICROBIAL ACTIVITY: Beneficial bacteria and fungi break down organic matter, make nutrients available to plants, improve soil structure. Healthy soil has active microbial life. Avoid overuse of chemicals that kill beneficial microbes.',
              '🔄 NUTRIENT CYCLING: Plants take up nutrients, return them to soil when they decompose. Some plants (legumes) add nitrogen to soil. Understanding this cycle helps you maintain soil fertility naturally.'
            ]
          },
          {
            id: 14,
            title: 'Root Systems & Nutrient Uptake - The Hidden Network',
            content: 'Root systems are the hidden foundation of plant health. Understanding how roots work helps you provide the best growing conditions:',
            points: [
              '🌱 ROOT TYPES: Taproots (deep, single main root), Fibrous roots (shallow, many small roots), Adventitious roots (grow from stems or leaves). Different plants have different root systems for different purposes.',
              '💧 WATER AND NUTRIENT UPTAKE: Roots absorb water and nutrients through root hairs. Most absorption happens in the top 6-12 inches of soil. Keep this zone healthy and well-fed for optimal plant growth.',
              '🌿 ROOT DEPTH: Shallow roots (lettuce, herbs) vs. deep roots (tomatoes, trees). Plant according to your soil depth and structure. Deep-rooted plants can access water and nutrients from deeper soil layers.',
              '🔄 ROOT GROWTH PATTERNS: Roots grow toward water and nutrients. They avoid compacted soil and toxic areas. Understanding this helps you place plants and amendments effectively.',
              '🦠 ROOT-MICROBE RELATIONSHIPS: Mycorrhizal fungi form partnerships with plant roots, extending the root system, improving nutrient uptake. Some plants depend on these relationships for optimal growth.',
              '💡 ROOT HEALTH INDICATORS: Healthy roots are white or light-colored, firm, and well-branched. Unhealthy roots are dark, mushy, or stunted. Check root health when repotting or transplanting.'
            ]
          },
          {
            id: 15,
            title: 'Advanced Soil Improvement Strategies - Building Better Soil',
            content: 'Good soil is the foundation of a successful garden. Here are proven strategies for improving your soil over time:',
            points: [
              '🌱 ORGANIC MATTER ADDITION: Add compost, manure, leaf mold, or other organic materials regularly. This improves soil structure, increases water retention, and feeds beneficial microbes. Aim for 1-2 inches per year.',
              '🔄 COVER CROPS: Plant cover crops in fallow areas to add organic matter, prevent erosion, fix nitrogen (legumes), break up compacted soil. Examples: clover, rye, buckwheat. Turn under before planting main crops.',
              '🌿 MULCHING: Apply organic mulch (straw, leaves, wood chips) to retain moisture, suppress weeds, add organic matter as it decomposes. Mulch also moderates soil temperature and prevents erosion.',
              '💧 PROPER WATERING: Water deeply and infrequently to encourage deep root growth. Avoid frequent shallow watering that keeps roots near the surface. Use drip irrigation or soaker hoses for efficient watering.',
              '🔄 CROP ROTATION: Rotate crops to prevent nutrient depletion, break pest cycles, improve soil structure. Different plants have different nutrient needs and root structures. Plan a 3-4 year rotation cycle.',
              '📊 REGULAR TESTING: Test soil every 2-3 years to monitor pH, nutrient levels, and organic matter content. This helps you make informed decisions about amendments and fertilizers.'
            ]
          }
        ],
        quiz: {
          title: 'Soil Chemistry & Plant Health Quiz',
          questions: [
            {
              id: 13,
              question: '🧪 SOIL CHEMISTRY: This soil test shows a pH of 8.2. What problem might plants experience?',
              image: '/images/quiz/quiz-alkaline-soil-test.jpg',
              imageDescription: 'Soil pH test result showing pH 8.2, indicating alkaline soil conditions',
              options: ['Iron deficiency (nutrients locked up)', 'Too much nitrogen', 'Perfect growing conditions', 'Too much organic matter'],
              correct: 0,
              explanation: '✅ CORRECT! Alkaline soil (pH 8.2) causes iron and other micronutrients to become unavailable to plants, leading to deficiency symptoms like yellowing leaves. This is common in areas with limestone bedrock or over-liming.'
            },
            {
              id: 14,
              question: '🌱 ROOT SYSTEM ANALYSIS: This plant has a deep taproot system. What advantage does this provide?',
              image: '/images/quiz/quiz-taproot-system.jpg',
              imageDescription: 'Plant with deep taproot system showing extensive vertical root growth',
              options: ['Better water access from deep soil', 'More surface area for nutrient uptake', 'Easier transplanting', 'Faster growth'],
              correct: 0,
              explanation: '✅ CORRECT! Deep taproot systems allow plants to access water and nutrients from deeper soil layers, making them more drought-tolerant and able to survive in challenging conditions where surface water is limited.'
            },
            {
              id: 15,
              question: '🔄 SOIL IMPROVEMENT: What is the primary benefit of adding organic matter to soil?',
              options: ['Increases soil pH', 'Improves soil structure and nutrient availability', 'Makes soil more alkaline', 'Reduces water retention'],
              correct: 1,
              explanation: '✅ CORRECT! Organic matter improves soil structure by creating pore spaces, increases nutrient availability by feeding beneficial microbes, and improves water retention. It\'s the foundation of healthy soil.'
            }
          ]
        }
      },
      {
        id: 'plant-disease-soil-management',
        title: 'Plant Disease & Soil Management - Prevention & Treatment',
        difficulty: 'Intermediate',
        estimatedTime: '55 min',
        description: 'Learn to identify, prevent, and treat plant diseases through proper soil management and cultural practices',
        lessons: [
          {
            id: 16,
            title: 'Understanding Plant Diseases - The Soil Connection',
            content: 'Many plant diseases start in the soil or are influenced by soil conditions. Understanding this connection is key to prevention:',
            points: [
              '🦠 SOIL-BORNE PATHOGENS: Many plant diseases live in soil and infect plants through roots. Examples: Fusarium wilt, Verticillium wilt, root rot fungi. These pathogens can survive in soil for years, making prevention crucial.',
              '💧 WATER AND DISEASE: Overwatering creates conditions favorable for root rot and fungal diseases. Poor drainage leads to waterlogged soil where harmful bacteria and fungi thrive. Proper watering and drainage are your first defense.',
              '🌱 SOIL pH AND DISEASE: Some diseases are more common in certain pH ranges. Clubroot (brassicas) thrives in acidic soil, while some fungal diseases prefer alkaline conditions. Adjusting pH can help prevent specific diseases.',
              '🔄 CROP ROTATION: Rotating crops prevents disease buildup in soil. Different plant families are susceptible to different diseases. A 3-4 year rotation cycle breaks disease cycles and maintains soil health.',
              '🌿 PLANT RESISTANCE: Some plant varieties are naturally resistant to certain diseases. Choose resistant varieties when available. Healthy plants grown in good soil are naturally more resistant to diseases.',
              '🧪 SOIL TESTING: Regular soil testing helps identify nutrient imbalances that can make plants more susceptible to diseases. Proper nutrition strengthens plant immune systems.'
            ]
          },
          {
            id: 17,
            title: 'Preventive Soil Management - Building Plant Immunity',
            content: 'The best defense against plant diseases is prevention through proper soil management and cultural practices:',
            points: [
              '🌱 SOIL STRUCTURE: Well-structured soil with good drainage prevents waterlogging that leads to root diseases. Add organic matter to improve soil structure and drainage. Avoid working soil when it\'s too wet.',
              '💧 WATER MANAGEMENT: Water plants at the base, not on leaves, to prevent foliar diseases. Use drip irrigation or soaker hoses. Water in the morning so leaves dry quickly. Avoid overhead watering that spreads diseases.',
              '🌿 PLANT SPACING: Proper spacing allows good air circulation, reducing humidity that favors fungal diseases. Crowded plants create microclimates that promote disease development. Follow recommended spacing guidelines.',
              '🔄 SANITATION: Remove diseased plant debris promptly. Don\'t compost diseased material unless you have a hot compost pile. Clean tools between plants to prevent disease spread. Start with clean, disease-free seeds and plants.',
              '🌱 SOIL AMENDMENTS: Add beneficial microbes through compost and organic matter. These compete with harmful pathogens. Some amendments like biochar can improve soil health and plant resistance.',
              '⏰ TIMING: Plant at the right time for your climate. Plants stressed by weather extremes are more susceptible to diseases. Avoid planting when conditions favor disease development.'
            ]
          },
          {
            id: 18,
            title: 'Treatment Strategies - When Prevention Fails',
            content: 'When diseases do occur, proper treatment can save plants and prevent spread. Here are effective treatment strategies:',
            points: [
              '🔍 EARLY DETECTION: Learn to recognize early disease symptoms. Yellowing leaves, spots, wilting, or stunted growth can indicate disease. Early intervention is more successful than waiting for severe symptoms.',
              '✂️ CULTURAL CONTROLS: Remove infected plant parts promptly. Prune diseased branches back to healthy tissue. Improve growing conditions (better drainage, proper watering, adequate nutrition) to help plants recover.',
              '🌿 ORGANIC TREATMENTS: Use organic fungicides like copper, sulfur, or neem oil for fungal diseases. These are less harmful to beneficial organisms than synthetic chemicals. Always follow label directions.',
              '🦠 BIOLOGICAL CONTROLS: Introduce beneficial organisms that compete with or attack disease-causing pathogens. Some beneficial bacteria and fungi can be added to soil to improve plant health.',
              '🧪 CHEMICAL CONTROLS: Use synthetic fungicides as a last resort and only when necessary. Choose products specific to the disease you\'re treating. Rotate different chemical classes to prevent resistance.',
              '📊 RECORD KEEPING: Keep records of diseases that occur in your garden. Note which plants were affected, when, and what treatments were used. This helps you plan better prevention strategies for the future.'
            ]
          }
        ],
        quiz: {
          title: 'Plant Disease & Soil Management Quiz',
          questions: [
            {
              id: 16,
              question: '🦠 DISEASE IDENTIFICATION: This plant shows wilting, yellowing leaves, and brown discoloration in the stem. The soil is waterlogged. What is the most likely cause?',
              image: '/images/quiz/quiz-root-rot-symptoms.jpg',
              imageDescription: 'Plant showing wilting, yellowing leaves, and stem discoloration in waterlogged soil conditions',
              options: ['Nutrient deficiency', 'Root rot disease', 'Too much sunlight', 'Insect damage'],
              correct: 1,
              explanation: '✅ CORRECT! These symptoms indicate root rot disease, which is common in waterlogged soil. Root rot fungi thrive in wet, poorly drained soil and cause wilting, yellowing, and stem discoloration as they damage the root system.'
            },
            {
              id: 17,
              question: '🌱 PREVENTIVE MEASURES: What is the most effective way to prevent soil-borne plant diseases?',
              options: ['Use more fertilizer', 'Improve soil drainage and structure', 'Plant closer together', 'Water more frequently'],
              correct: 1,
              explanation: '✅ CORRECT! Improving soil drainage and structure is the most effective way to prevent soil-borne diseases. Well-drained soil with good structure prevents waterlogging that favors disease-causing pathogens and promotes healthy root development.'
            },
            {
              id: 18,
              question: '🔄 CROP ROTATION: Why is crop rotation important for disease prevention?',
              options: ['It saves water', 'It breaks disease cycles and prevents pathogen buildup', 'It makes plants grow faster', 'It reduces fertilizer needs'],
              correct: 1,
              explanation: '✅ CORRECT! Crop rotation breaks disease cycles by preventing the buildup of soil-borne pathogens that are specific to certain plant families. This is especially important for diseases that can survive in soil for multiple years.'
            }
          ]
        }
      }
    ],
    'Expert': [
      {
        id: 'professional-soil-analysis',
        title: 'Professional Soil Analysis - The Science of Soil Health',
        difficulty: 'Expert',
        estimatedTime: '60 min',
        description: 'Master professional soil testing, analysis techniques, and advanced soil management for optimal plant health and productivity',
        lessons: [
          {
            id: 19,
            title: 'Professional Soil Testing Methods - Laboratory Analysis',
            content: 'Professional soil analysis goes beyond simple pH tests. Here\'s how to conduct comprehensive soil testing for optimal plant health:',
            points: [
              '🧪 LABORATORY TESTING: Send soil samples to professional labs for comprehensive analysis. Tests include pH, nutrient levels, organic matter, CEC, and micronutrients. This provides the most accurate and detailed information.',
              '📊 SAMPLING TECHNIQUES: Take multiple samples from different areas, mix them together, and send a composite sample. Avoid areas near buildings, roads, or where fertilizers were recently applied. Sample depth should match root zone depth.',
              '🌱 FIELD TESTING: Use portable meters for pH, moisture, and light. These provide quick, on-site results but may be less accurate than lab tests. Good for regular monitoring and quick assessments.',
              '🔬 SOIL STRUCTURE ANALYSIS: Assess soil texture, compaction, drainage, and root penetration. Use simple tests like the ribbon test for texture, infiltration test for drainage, and penetration test for compaction.',
              '🦠 BIOLOGICAL TESTING: Assess soil microbial activity, earthworm populations, and organic matter decomposition. Healthy soil has active biological life. Use simple tests like the tea bag test for decomposition rates.',
              '📈 INTERPRETING RESULTS: Compare results to optimal ranges for your plants. Consider seasonal variations, recent amendments, and plant performance. Use results to develop a soil improvement plan.'
            ]
          },
          {
            id: 20,
            title: 'Advanced Nutrient Analysis - Understanding Plant Nutrition',
            content: 'Understanding nutrient analysis helps you provide exactly what your plants need for optimal growth and health:',
            points: [
              '📊 NUTRIENT RATIOS: Plants need nutrients in specific ratios. N-P-K ratios vary by plant type and growth stage. Leafy plants need more nitrogen, flowering plants need more phosphorus, fruiting plants need more potassium.',
              '⚡ NUTRIENT AVAILABILITY: Soil pH affects nutrient availability. Most nutrients are available at pH 6.0-7.0. Some nutrients become unavailable at extreme pH levels. Adjust pH to optimize nutrient uptake.',
              '🔄 NUTRIENT CYCLING: Understand how nutrients move through the soil-plant system. Some nutrients are mobile (move with water), others are immobile (stay in place). This affects how and when to apply fertilizers.',
              '🌱 PLANT TISSUE TESTING: Analyze plant tissue to see what nutrients plants are actually taking up. This complements soil testing and helps identify nutrient deficiencies or toxicities. Test leaves during active growth.',
              '💧 FERTILIZER CALCULATIONS: Calculate exact fertilizer needs based on soil test results and plant requirements. Consider nutrient release rates, application timing, and environmental factors. Avoid over-fertilization.',
              '🔄 LONG-TERM MONITORING: Track nutrient levels over time to see how your soil improvement efforts are working. Regular testing helps you maintain optimal soil fertility and catch problems early.'
            ]
          },
          {
            id: 21,
            title: 'Soil Remediation Strategies - Fixing Complex Problems',
            content: 'When soil tests reveal problems, here are proven strategies for remediation and improvement:',
            points: [
              '🌱 pH ADJUSTMENT: Add lime to raise pH (make less acidic), add sulfur to lower pH (make more acidic). Changes take time - test again in 6-12 months. Make gradual adjustments to avoid shocking plants.',
              '💧 DRAINAGE IMPROVEMENT: Install drainage systems, add organic matter, create raised beds, or use plants that tolerate wet conditions. Poor drainage is a common problem that affects plant health and nutrient availability.',
              '🌿 COMPACTION REMEDIATION: Use deep tillage, add organic matter, plant cover crops with deep roots, or use mechanical aeration. Compacted soil restricts root growth and reduces water and nutrient availability.',
              '🔄 SALINITY MANAGEMENT: Leach excess salts with deep watering, add organic matter, use salt-tolerant plants, or improve drainage. High salinity can damage plants and reduce nutrient availability.',
              '🦠 BIOLOGICAL RESTORATION: Add compost, use cover crops, avoid chemical inputs, and encourage beneficial microbes. Healthy soil biology is essential for plant health and nutrient cycling.',
              '📊 MONITORING PROGRESS: Track improvements over time with regular testing. Soil improvement is a long-term process that requires patience and persistence. Celebrate small improvements and stay committed to the process.'
            ]
          }
        ],
        quiz: {
          title: 'Professional Soil Analysis Quiz',
          questions: [
            {
              id: 19,
              question: '🧪 SOIL TEST INTERPRETATION: This soil test report shows a CEC of 8. What does this indicate?',
              image: '/images/quiz/quiz-soil-test-report.jpg',
              imageDescription: 'Professional soil test report showing CEC (Cation Exchange Capacity) value of 8',
              options: ['High nutrient holding capacity', 'Low nutrient holding capacity', 'Perfect pH level', 'High organic matter'],
              correct: 1,
              explanation: '✅ CORRECT! A CEC (Cation Exchange Capacity) of 8 indicates low nutrient holding capacity. This soil will need more frequent fertilization as nutrients will leach away quickly. High CEC soils (20+) hold nutrients much better.'
            },
            {
              id: 20,
              question: '📊 NUTRIENT ANALYSIS: This plant tissue test shows high nitrogen but low phosphorus levels. What should you do?',
              image: '/images/quiz/quiz-plant-tissue-test.jpg',
              imageDescription: 'Plant tissue analysis results showing nutrient levels in plant leaves',
              options: ['Add more nitrogen', 'Apply phosphorus-rich fertilizer', 'Reduce watering', 'Increase sunlight'],
              correct: 1,
              explanation: '✅ CORRECT! The plant tissue test shows the plant is taking up plenty of nitrogen but not enough phosphorus. Apply a phosphorus-rich fertilizer (like 10-20-10) to address this specific deficiency and improve flowering/fruiting.'
            },
            {
              id: 21,
              question: '🌱 SOIL REMEDIATION: This soil is heavily compacted with poor drainage. What is the best long-term solution?',
              image: '/images/quiz/quiz-compacted-soil.jpg',
              imageDescription: 'Heavily compacted soil showing poor structure and drainage issues',
              options: ['Add more water', 'Add organic matter and use cover crops', 'Use more fertilizer', 'Plant deeper'],
              correct: 1,
              explanation: '✅ CORRECT! Adding organic matter and using cover crops with deep roots is the best long-term solution for compacted soil. This improves soil structure, drainage, and biological activity, creating lasting improvements rather than temporary fixes.'
            }
          ]
        }
      },
      {
        id: 'advanced-plant-physiology',
        title: 'Advanced Plant Physiology - Understanding Plant Biology',
        difficulty: 'Expert',
        estimatedTime: '65 min',
        description: 'Master the complex biological processes that govern plant growth, development, and response to environmental conditions',
        lessons: [
          {
            id: 22,
            title: 'Plant Growth & Development - The Biological Foundation',
            content: 'Understanding plant physiology helps you provide optimal growing conditions and troubleshoot problems effectively:',
            points: [
              '🌱 PHOTOSYNTHESIS: The process by which plants convert light energy into chemical energy. Requires light, carbon dioxide, and water. Understanding this process helps optimize light conditions and CO2 levels for maximum growth.',
              '💧 TRANSPIRATION: The process by which plants lose water through their leaves. This creates a "pull" that draws water and nutrients from roots. High humidity reduces transpiration, while low humidity increases it.',
              '🌿 NUTRIENT UPTAKE: Plants absorb nutrients through their roots via active transport and passive diffusion. Root health is crucial for nutrient uptake. Mycorrhizal fungi can extend the root system and improve nutrient absorption.',
              '🔄 PLANT HORMONES: Auxins (growth), Cytokinins (cell division), Gibberellins (stem elongation), Abscisic acid (stress response). Understanding these helps explain plant responses to pruning, stress, and environmental changes.',
              '⏰ PHOTOPERIODISM: How plants respond to day length. Short-day plants flower when days are short, long-day plants flower when days are long. This affects when to plant and how to manage flowering.',
              '🌡️ THERMOPERIODISM: How plants respond to temperature changes. Many plants need specific temperature ranges for optimal growth, flowering, and fruiting. Understanding this helps with timing and location decisions.'
            ]
          },
          {
            id: 23,
            title: 'Plant Stress Response - Reading Plant Signals',
            content: 'Plants communicate their needs and problems through visible signs. Learning to read these signals is crucial for expert plant care:',
            points: [
              '🔍 STRESS INDICATORS: Wilting (water stress), Yellowing (nutrient deficiency), Browning (toxicity or disease), Stunted growth (root problems), Leaf drop (environmental stress). Each symptom tells a story about what the plant needs.',
              '💧 WATER STRESS: Underwatering causes wilting, yellowing, and stunted growth. Overwatering causes root rot, yellowing, and leaf drop. Learn to distinguish between these symptoms for proper treatment.',
              '🌱 NUTRIENT STRESS: Different nutrients cause different deficiency symptoms. Nitrogen deficiency causes overall yellowing, phosphorus deficiency causes purple leaves, potassium deficiency causes brown leaf edges.',
              '🌡️ ENVIRONMENTAL STRESS: Temperature extremes, humidity problems, light issues, and air pollution all cause specific symptoms. Understanding these helps you adjust growing conditions appropriately.',
              '🦠 BIOTIC STRESS: Pests and diseases cause characteristic symptoms. Learn to distinguish between pest damage, disease symptoms, and environmental problems for effective treatment.',
              '⏰ TIMING OF SYMPTOMS: When symptoms appear can provide clues about the cause. Sudden symptoms often indicate environmental stress, while gradual symptoms may indicate nutrient deficiencies or diseases.'
            ]
          },
          {
            id: 24,
            title: 'Optimizing Plant Performance - The Expert Approach',
            content: 'Combine your knowledge of plant physiology with practical techniques to achieve maximum plant health and productivity:',
            points: [
              '🎯 PRECISION CULTURE: Use your understanding of plant physiology to create optimal growing conditions. Adjust light, temperature, humidity, and nutrition based on plant needs and growth stage.',
              '🌱 GROWTH STAGE MANAGEMENT: Different growth stages have different needs. Seedlings need gentle conditions, vegetative growth needs high nitrogen, flowering needs high phosphorus, fruiting needs high potassium.',
              '💧 WATER OPTIMIZATION: Understand transpiration rates and adjust watering accordingly. Use techniques like deep watering, mulching, and proper drainage to optimize water use and plant health.',
              '🌿 NUTRIENT TIMING: Apply nutrients when plants can use them most effectively. Match nutrient applications to growth stages and environmental conditions for maximum efficiency.',
              '🔄 STRESS MANAGEMENT: Use your knowledge of plant stress responses to prevent problems before they occur. Create stable growing conditions and monitor plants regularly for early signs of stress.',
              '📊 PERFORMANCE MONITORING: Track plant performance over time to identify what works best in your specific conditions. Keep detailed records of growing conditions, treatments, and results.'
            ]
          }
        ],
        quiz: {
          title: 'Advanced Plant Physiology Quiz',
          questions: [
            {
              id: 22,
              question: '🌱 PLANT PROCESSES: This plant is showing rapid growth but no flowers. What process is likely dominating?',
              image: '/images/quiz/quiz-vegetative-growth.jpg',
              imageDescription: 'Plant showing vigorous vegetative growth with large leaves but no flowering',
              options: ['Photosynthesis (energy production)', 'Vegetative growth (auxin dominance)', 'Flowering (gibberellin activity)', 'Root development (cytokinin activity)'],
              correct: 1,
              explanation: '✅ CORRECT! Rapid vegetative growth without flowering indicates auxin dominance, which promotes stem and leaf growth while inhibiting flowering. This is common in young plants or when nitrogen levels are high.'
            },
            {
              id: 23,
              question: '🔍 STRESS DIAGNOSIS: This plant shows yellowing between leaf veins while veins remain green. What is the most likely cause?',
              image: '/images/quiz/quiz-interveinal-chlorosis.jpg',
              imageDescription: 'Plant leaves showing interveinal chlorosis - yellowing between green veins',
              options: ['Nitrogen deficiency (overall yellowing)', 'Iron deficiency (interveinal chlorosis)', 'Overwatering (root rot)', 'Too much light (leaf burn)'],
              correct: 1,
              explanation: '✅ CORRECT! Interveinal chlorosis (yellowing between green veins) is a classic sign of iron deficiency. This is common in alkaline soils where iron becomes unavailable to plants, or in plants with poor root health.'
            },
            {
              id: 24,
              question: '🌡️ ENVIRONMENTAL RESPONSE: This plant is dropping leaves rapidly after being moved to a new location. What is the most likely cause?',
              image: '/images/quiz/quiz-leaf-drop.jpg',
              imageDescription: 'Plant showing rapid leaf drop after environmental change',
              options: ['Nutrient deficiency', 'Environmental stress (shock)', 'Pest infestation', 'Disease infection'],
              correct: 1,
              explanation: '✅ CORRECT! Rapid leaf drop after moving a plant is typically caused by environmental stress or shock. Plants respond to sudden changes in light, temperature, or humidity by dropping leaves to conserve energy and water.'
            }
          ]
        }
      },
      {
        id: 'sustainable-gardening-systems',
        title: 'Sustainable Gardening Systems - The Future of Plant Care',
        difficulty: 'Expert',
        estimatedTime: '70 min',
        description: 'Design and implement sustainable gardening systems that work with nature for long-term success',
        lessons: [
          {
            id: 25,
            title: 'Ecosystem Design - Working with Nature',
            content: 'Create gardens that function as complete ecosystems, reducing maintenance while improving plant health:',
            points: [
              '🌿 PERMACULTURE PRINCIPLES: Design gardens that mimic natural ecosystems. Use companion planting, polycultures, and beneficial relationships between plants, animals, and microorganisms for sustainable success.',
              '🔄 NUTRIENT CYCLING: Create closed-loop systems where waste becomes resources. Use compost, cover crops, and plant diversity to maintain soil fertility without external inputs. This reduces costs and environmental impact.',
              '🌱 BIODIVERSITY: Increase plant and animal diversity to create resilient ecosystems. Different plants attract different beneficial insects, improve soil health, and provide multiple functions. This creates natural pest control and pollination.',
              '💧 WATER MANAGEMENT: Design systems that capture, store, and efficiently use water. Use swales, rain gardens, and water-wise plants to create drought-resistant gardens that work with natural water cycles.',
              '🦠 SOIL FOOD WEB: Foster beneficial soil microorganisms that support plant health. Use compost, avoid chemicals, and maintain soil organic matter to create thriving soil ecosystems that naturally suppress diseases and pests.',
              '🌍 CLIMATE ADAPTATION: Choose plants and techniques that work with your local climate and conditions. Use native plants, microclimates, and seasonal planning to create gardens that thrive with minimal intervention.'
            ]
          },
          {
            id: 26,
            title: 'Advanced Soil Building - Creating Living Soil',
            content: 'Build and maintain soil that gets better over time through natural processes and minimal intervention:',
            points: [
              '🌱 NO-TILL GARDENING: Minimize soil disturbance to preserve soil structure and beneficial microorganisms. Use techniques like sheet mulching, cover crops, and surface applications to build soil without tilling.',
              '🔄 COMPOST SYSTEMS: Create multiple compost systems for different purposes. Hot compost for quick breakdown, cold compost for slow release, and vermicompost for nutrient-rich amendments. This provides continuous soil improvement.',
              '🌿 COVER CROPS: Use living plants to build soil, suppress weeds, and provide nutrients. Choose cover crops based on your needs: nitrogen fixation, organic matter, weed suppression, or specific nutrient contributions.',
              '🦠 MICROBIAL INOCULANTS: Introduce beneficial microorganisms to jumpstart soil health. Use compost tea, mycorrhizal fungi, and beneficial bacteria to establish healthy soil ecosystems that support plant growth.',
              '🌱 MULCHING SYSTEMS: Use organic mulches to protect soil, retain moisture, and provide nutrients. Different mulches serve different purposes: straw for vegetables, wood chips for perennials, leaves for acid-loving plants.',
              '📊 SOIL MONITORING: Track soil health over time using simple tests and observations. Monitor organic matter, biological activity, and plant performance to ensure your soil-building efforts are working effectively.'
            ]
          },
          {
            id: 27,
            title: 'Long-term Garden Management - Sustainable Success',
            content: 'Develop systems and strategies for maintaining healthy, productive gardens with minimal ongoing effort:',
            points: [
              '📅 SEASONAL PLANNING: Create year-round garden plans that maximize productivity while maintaining soil health. Use succession planting, crop rotation, and seasonal cover crops to keep gardens productive and healthy.',
              '🌱 PLANT SELECTION: Choose plants that are well-adapted to your conditions and provide multiple benefits. Select for disease resistance, low maintenance, and ecosystem value. This reduces problems and increases success.',
              '🔄 MAINTENANCE SYSTEMS: Develop efficient routines for garden care that work with natural processes. Use techniques like chop-and-drop mulching, integrated pest management, and minimal intervention approaches.',
              '🌿 PROBLEM PREVENTION: Design gardens to prevent common problems before they occur. Use diversity, proper spacing, and healthy soil to create conditions that naturally suppress diseases and pests.',
              '💧 RESOURCE EFFICIENCY: Maximize the use of available resources like water, nutrients, and space. Use techniques like intercropping, vertical gardening, and water-wise design to get maximum results from minimal inputs.',
              '📊 CONTINUOUS IMPROVEMENT: Regularly assess and improve your garden systems. Keep records, experiment with new techniques, and adapt your approach based on results. This ensures long-term success and learning.'
            ]
          }
        ],
        quiz: {
          title: 'Sustainable Gardening Systems Quiz',
          questions: [
            {
              id: 25,
              question: '🌿 ECOSYSTEM DESIGN: This garden shows multiple plant types growing together with no bare soil visible. What principle is being demonstrated?',
              image: '/images/quiz/quiz-polyculture-garden.jpg',
              imageDescription: 'Diverse garden with multiple plant types growing together in a natural, layered arrangement',
              options: ['Monoculture (single crop)', 'Polyculture (multiple crops)', 'Container gardening', 'Hydroponic growing'],
              correct: 1,
              explanation: '✅ CORRECT! This garden demonstrates polyculture - growing multiple plant types together. This creates biodiversity, improves soil health, and provides natural pest control, making the garden more resilient and sustainable.'
            },
            {
              id: 26,
              question: '🔄 SOIL BUILDING: This garden shows plants growing through a thick layer of organic material. What technique is being used?',
              image: '/images/quiz/quiz-mulched-garden.jpg',
              imageDescription: 'Garden with plants growing through a thick layer of organic mulch material',
              options: ['Chemical fertilization', 'Sheet mulching', 'Tilling and cultivation', 'Hydroponic growing'],
              correct: 1,
              explanation: '✅ CORRECT! This garden uses sheet mulching - covering the soil with organic materials. This builds soil, suppresses weeds, retains moisture, and provides nutrients as the mulch decomposes, creating a sustainable soil-building system.'
            },
            {
              id: 27,
              question: '🌱 SUSTAINABLE PRACTICES: This garden shows plants at different growth stages in the same bed. What technique is being demonstrated?',
              image: '/images/quiz/quiz-succession-planting.jpg',
              imageDescription: 'Garden bed showing plants at different growth stages, indicating continuous planting',
              options: ['Single planting', 'Succession planting', 'Transplanting', 'Seed saving'],
              correct: 1,
              explanation: '✅ CORRECT! This garden demonstrates succession planting - planting crops at different times to ensure continuous harvest. This maximizes productivity, maintains soil health, and provides a steady supply of fresh produce throughout the growing season.'
            }
          ]
        }
      }
    ]
  }
}

export const getModuleData = (difficulty) => {
  const allModules = getLearningPathModules()
  return allModules[difficulty] || []
}
