import type { GameScene, PlayerStats, SceneData } from "./game-types"

export function getSceneData(scene: GameScene, stats: PlayerStats, visited: Set<string>, role: string): SceneData {
  const scenes: Record<GameScene, SceneData> = {
    airport_dropoff: {
      title: "Airport Drop-Off",
      icon: "🚗",
      description:
        "Your Uber screeches to a halt at the curb. 'EDGE AI San Diego 2026 — here we come!' you mutter, checking your watch. The terminal looms ahead, packed with travelers. Your flight leaves in 90 minutes. {playerName}, the clock is ticking!",
      choices: [
        {
          text: "Sprint inside immediately — no time to waste!",
          icon: "🏃",
          effects: { energy: -15, stress: 10 },
          result: "You burst through the doors, heart pounding. Every second counts!",
          nextScene: "luggage_dilemma",
        },
        {
          text: "Take a deep breath and walk calmly",
          icon: "🚶",
          effects: { energy: -5, stress: -5 },
          result: "You compose yourself. Panic leads to mistakes.",
          nextScene: "airport_entrance",
        },
        {
          text: "Tip the driver extra for good luck",
          icon: "💵",
          cost: 10,
          effects: { money: -10, stress: -10 },
          result: "'Good karma for your journey!' the driver smiles.",
          nextScene: "airport_entrance",
        },
      ],
    },

    airport_entrance: {
      title: "Terminal Entrance",
      icon: "🏛️",
      description:
        "The automatic doors whoosh open to reveal chaos. Flight status boards flash delays and gate changes. A family argues over a mountain of luggage. Someone's emotional support peacock squawks loudly. Welcome to modern air travel.",
      choices: [
        {
          text: "Check the departure board first",
          icon: "📋",
          effects: { stress: -5, knowledge: 2 },
          result: "Gate B42. Good, it hasn't changed... yet.",
          nextScene: "luggage_dilemma",
        },
        {
          text: "Head straight to check-in",
          icon: "➡️",
          effects: { energy: -5 },
          result: "Time is money. Or in this case, time is catching your flight.",
          nextScene: "luggage_dilemma",
        },
        {
          text: "Stop at the information desk",
          icon: "ℹ️",
          effects: { stress: -10, knowledge: 3 },
          result: "The agent confirms your gate and mentions a TSA PreCheck shortcut!",
          nextScene: "luggage_dilemma",
        },
      ],
    },

    luggage_dilemma: {
      title: "The Luggage Dilemma",
      icon: "🧳",
      description:
        "You look down at your suitcase. The check-in line snakes around twice. The carry-on only lane is completely empty. Your suitcase is juuust over the size limit. A porter catches your eye and winks.",
      choices: [
        {
          text: "Risk it as carry-on (it'll probably fit...)",
          icon: "🎲",
          effects: { stress: 15, energy: -10 },
          result:
            Math.random() > 0.4
              ? "The gate agent doesn't even look twice. You're in!"
              : "BEEP! 'Sir, that bag needs to be checked.' Back of the line for you.",
          nextScene: "security_line",
        },
        {
          text: "Check the bag properly",
          icon: "✅",
          effects: { energy: -10, stress: 5, money: -35 },
          result: "Baggage fee: $35. But at least that's one less thing to worry about.",
          nextScene: "security_line",
        },
        {
          text: "Pay the porter for 'expedited handling'",
          icon: "💰",
          cost: 25,
          effects: { money: -25, stress: -15, connections: 1 },
          result: "'I know people,' he grins. Your bag vanishes through a staff door.",
          nextScene: "security_line",
        },
        {
          text: "Stuff essentials into laptop bag, abandon suitcase",
          icon: "🎒",
          effects: { stress: 20, energy: -5 },
          result: "Drastic times call for drastic measures. You'll shop in San Diego.",
          nextScene: "security_line",
        },
      ],
    },

    security_line: {
      title: "Security Serpent",
      icon: "🐍",
      description:
        "The security line stretches endlessly, a human snake of frustration. A TSA agent yells 'LAPTOPS OUT! SHOES OFF!' Someone ahead forgot about their water bottle. A baby is crying. Another baby joins in harmony.",
      choices: [
        {
          text: "Wait patiently in the regular line",
          icon: "⏳",
          effects: { energy: -20, stress: 20 },
          result: "45 minutes later, you reach the scanners. Your legs ache.",
          nextScene: "tsa_checkpoint",
        },
        {
          text: "Try the TSA PreCheck line (if eligible)",
          icon: "⚡",
          effects: { energy: -5, stress: -5 },
          result:
            role === "executive"
              ? "Executive privilege! PreCheck whisks you through."
              : "Sorry, your profile doesn't have PreCheck. Regular line it is.",
          nextScene: "tsa_checkpoint",
        },
        {
          text: "Strike up conversation with nearby traveler",
          icon: "💬",
          effects: { stress: -10, connections: 1, knowledge: 2 },
          result: "'Heading to EDGE AI too? Small world!' You exchange LinkedIn info.",
          nextScene: "tsa_checkpoint",
        },
        {
          text: "Meditate to pass the time",
          icon: "🧘",
          effects: { stress: -15, energy: 5 },
          result: "You find your zen amidst the chaos. The crying babies become white noise.",
          nextScene: "tsa_checkpoint",
        },
      ],
    },

    tsa_checkpoint: {
      title: "TSA Checkpoint",
      icon: "🛂",
      description:
        "You reach the X-ray machines. A stern agent examines IDs with the intensity of someone defusing a bomb. Your laptop bag goes through the scanner. The machine BEEPS. The agent's eyes narrow.",
      choices: [
        {
          text: "Remain calm and cooperative",
          icon: "😊",
          effects: { stress: 10, energy: -5 },
          result: "Just a random check. 'You're clear.' Phew.",
          nextScene: "food_court",
        },
        {
          text: "'It's probably my neural compute stick!'",
          icon: "🤓",
          effects: { stress: -5, knowledge: 3 },
          result: "The agent is intrigued. 'Edge AI stuff? Cool.' They let you through with a nod.",
          nextScene: "food_court",
        },
        {
          text: "Make a nervous joke",
          icon: "😅",
          effects: { stress: 25 },
          result: "'Sir, please step aside for additional screening.' Bad move.",
          nextScene: "food_court",
        },
        {
          text: "Offer to explain what's in your bag",
          icon: "📖",
          effects: { energy: -10, knowledge: 2, connections: 1 },
          result: "The agent turns out to be interested in ML! You give a mini-lecture on tinyML.",
          nextScene: "food_court",
        },
      ],
    },

    food_court: {
      title: "Food Court Temptation",
      icon: "🍕",
      description:
        "You've made it past security! The food court beckons with its siren call of overpriced pizza and questionable sushi. Your stomach growls. The gate is a 10-minute walk. You have maybe 35 minutes until boarding.",
      choices: [
        {
          text: "Grab a quick coffee and energy bar",
          icon: "☕",
          cost: 12,
          effects: { money: -12, energy: 20, stress: -5 },
          result: "Caffeine coursing through your veins. You're ready for anything!",
          nextScene: "gate_rush",
        },
        {
          text: "Get a proper meal — you need the fuel",
          icon: "🍔",
          cost: 22,
          effects: { money: -22, energy: 35, stress: 10 },
          result: "That took longer than expected. You eat while speed-walking to the gate.",
          nextScene: "gate_rush",
        },
        {
          text: "Skip food entirely — no time!",
          icon: "🏃",
          effects: { energy: -15, stress: 15 },
          result: "Your stomach protests loudly. A nearby kid stares.",
          nextScene: "gate_rush",
        },
        {
          text: "Buy snacks for the plane",
          icon: "🍿",
          cost: 15,
          effects: { money: -15, energy: 10, addItem: "snacks" },
          result: "Trail mix, chips, and an overpriced chocolate bar. Flight essentials.",
          nextScene: "gate_rush",
        },
      ],
    },

    gate_rush: {
      title: "The Gate Rush",
      icon: "🚨",
      description:
        "You check your watch. 20 minutes to boarding. Gate B42 is in Terminal B. You're in Terminal A. The moving walkway is broken. A golf cart driver asks if you need a ride. 'NOW BOARDING FLIGHT 847 TO SAN DIEGO.'",
      choices: [
        {
          text: "SPRINT! Full speed ahead!",
          icon: "🏃‍♂️",
          effects: { energy: -30, stress: 20 },
          result: "You arrive panting, sweating, but THERE. Made it!",
          nextScene: "boarding",
        },
        {
          text: "Take the golf cart ($10 tip expected)",
          icon: "🛺",
          cost: 10,
          effects: { money: -10, energy: -5, stress: -10 },
          result: "'Beep beep! VIP coming through!' The driver weaves through crowds expertly.",
          nextScene: "boarding",
        },
        {
          text: "Fast walk — pace yourself",
          icon: "🚶‍♂️",
          effects: { energy: -15, stress: 10 },
          result: "Power walking champion mode activated. You arrive just in time.",
          nextScene: "boarding",
        },
        {
          text: "Find an alternate route through shops",
          icon: "🛍️",
          effects: { energy: -10, stress: 5, knowledge: 1 },
          result: "Shortcut through duty-free! You emerge right at the gate.",
          nextScene: "boarding",
        },
      ],
    },

    boarding: {
      title: "Boarding Call",
      icon: "✈️",
      description:
        "You made it! The gate agent scans your boarding pass. BEEP. Green light. But wait — there's a commotion. A passenger is arguing about overhead bin space. The line isn't moving. Your seat is 23C. Middle seat.",
      choices: [
        {
          text: "Wait patiently for your zone",
          icon: "⏳",
          effects: { stress: 10, energy: -5 },
          result: "Zone 4. You're one of the last to board. Overhead bins are stuffed.",
          nextScene: "plane_seat",
        },
        {
          text: "Ask politely if you can board early",
          icon: "🙏",
          effects: { stress: -5, connections: 1 },
          result: "The agent smiles. 'Go ahead.' Kindness wins!",
          nextScene: "plane_seat",
        },
        {
          text: "Pretend to need extra time to board",
          icon: "🎭",
          effects: { stress: 15 },
          result:
            Math.random() > 0.5
              ? "It works! You board with the early group."
              : "The agent isn't fooled. 'Please wait for your zone.'",
          nextScene: "plane_seat",
        },
        {
          text: "Help the arguing passenger with their bag",
          icon: "🤝",
          effects: { energy: -10, stress: -10, connections: 1 },
          result: "'Thanks! I work at Qualcomm!' They hand you their business card.",
          nextScene: "plane_seat",
        },
      ],
    },

    plane_seat: {
      title: "Finding Your Seat",
      icon: "💺",
      description:
        "You navigate the narrow aisle, bags bumping shoulders. 21... 22... 23C. Your seatmates are already settled: a large man spilling into your space, and a teenager with music blasting from headphones. The overhead bin above is full.",
      choices: [
        {
          text: "Accept your fate and squeeze in",
          icon: "😤",
          effects: { stress: 20, energy: -10 },
          result: "Sardine mode engaged. It's going to be a long flight.",
          nextScene: "plane_events",
        },
        {
          text: "Ask the flight attendant about other seats",
          icon: "✋",
          effects: { stress: -10, connections: 1 },
          result: "'Actually, 4A is open!' First class upgrade! Today's your lucky day.",
          nextScene: "plane_events",
        },
        {
          text: "Strike up conversation with seatmates",
          icon: "💬",
          effects: { stress: -5, energy: -5, connections: 1, knowledge: 2 },
          result: "The large man is a hardware engineer! The teen is into ML. Small world!",
          nextScene: "plane_events",
        },
        {
          text: "Put on noise-canceling headphones immediately",
          icon: "🎧",
          effects: { stress: -15 },
          result: "Your own little bubble of peace. Perfect.",
          nextScene: "plane_events",
        },
      ],
    },

    plane_events: {
      title: "In-Flight Adventures",
      icon: "☁️",
      description:
        "The plane reaches cruising altitude. The seatbelt sign dings off. A baby starts crying. The drink cart approaches. Turbulence shakes the cabin. Someone opens a pungent meal. Another passenger keeps kicking your seat.",
      choices: [
        {
          text: "Work on your EDGE AI presentation",
          icon: "💻",
          effects: { energy: -15, knowledge: 10, stress: 5 },
          result: "Three hours of focused work! Your slides are now amazing.",
          nextScene: "plane_landing",
        },
        {
          text: "Sleep through the flight",
          icon: "😴",
          effects: { energy: 30, stress: -20 },
          result: "You wake up refreshed as the landing announcement plays.",
          nextScene: "plane_landing",
        },
        {
          text: "Watch the in-flight AI documentary",
          icon: "🎬",
          effects: { knowledge: 8, stress: -10 },
          result: "'The Future of Edge Computing' — surprisingly good! You take notes.",
          nextScene: "plane_landing",
        },
        {
          text: "Network with nearby passengers",
          icon: "🤝",
          effects: { energy: -10, connections: 2, knowledge: 5 },
          result: "You meet a VC interested in edge AI startups and a professor from UCSD!",
          nextScene: "plane_landing",
        },
      ],
    },

    plane_landing: {
      title: "Descent into San Diego",
      icon: "🌅",
      description:
        "The captain announces your descent. Through the window, you see the Pacific Ocean sparkling, the curved coastline of San Diego, and... is that the famous Convention Center? Palm trees dot the landscape. You're almost there!",
      choices: [
        {
          text: "Review your schedule for the conference",
          icon: "📅",
          effects: { knowledge: 5, stress: -5 },
          result: "Keynote at 9AM, workshops at 2PM, networking dinner at 7PM. Packed schedule!",
          nextScene: "san_arrival",
        },
        {
          text: "Take photos of the view",
          icon: "📸",
          effects: { stress: -10, energy: -5 },
          result: "Instagram gold! #EdgeAISanDiego #AlmostThere",
          nextScene: "san_arrival",
        },
        {
          text: "Mentally prepare for the final stretch",
          icon: "🧠",
          effects: { stress: -15, knowledge: 3 },
          result: "You visualize success. Walking into EVE. The crowd. The energy.",
          nextScene: "san_arrival",
        },
      ],
    },

    san_arrival: {
      title: "Welcome to San Diego!",
      icon: "🌴",
      description:
        "Wheels down! San Diego International Airport. The warm California sun greets you as you exit the jetway. Palm trees sway outside the windows. Signs point to Ground Transportation. EVE venue is 15 minutes away. The home stretch!",
      choices: [
        {
          text: "Head straight to Ground Transportation",
          icon: "🚶",
          effects: { energy: -5 },
          result: "No time for sightseeing. Edge AI awaits!",
          nextScene: "transport_choice",
        },
        {
          text: "Stop at baggage claim first",
          icon: "🧳",
          effects: { energy: -10, stress: 10 },
          result: "You wait for your bag... and it arrives! Lucky!",
          nextScene: "transport_choice",
        },
        {
          text: "Grab a San Diego souvenir",
          icon: "🎁",
          cost: 20,
          effects: { money: -20, stress: -10, addItem: "souvenir" },
          result: "A tiny surfboard keychain and 'I love SD' shirt. Conference swag preview!",
          nextScene: "transport_choice",
        },
      ],
    },

    transport_choice: {
      title: "Getting to EVE",
      icon: "🚕",
      description:
        "You emerge into the San Diego sunshine. The venue, EVE, is in the heart of downtown near the Gaslamp Quarter. Options abound: Uber/Lyft surge pricing is 2.3x, the trolley runs every 15 minutes, a taxi line stretches around the corner.",
      choices: [
        {
          text: "Take a rideshare (Uber/Lyft)",
          icon: "📱",
          cost: 35,
          effects: { money: -35, energy: -5, stress: -10 },
          result: "Surge pricing hurts, but you'll arrive in style and comfort.",
          nextScene: "downtown_journey",
        },
        {
          text: "Hop on the San Diego Trolley",
          icon: "🚃",
          cost: 5,
          effects: { money: -5, energy: -10, stress: 5, knowledge: 2 },
          result: "Scenic route through downtown! You pass the Convention Center and Petco Park.",
          nextScene: "downtown_journey",
        },
        {
          text: "Share a taxi with another conference attendee",
          icon: "🚖",
          cost: 15,
          effects: { money: -15, connections: 1 },
          result: "'Going to EDGE AI? Me too!' Split the fare, make a friend.",
          nextScene: "downtown_journey",
        },
        {
          text: "Walk — it's only a couple miles!",
          icon: "🚶‍♂️",
          effects: { energy: -25, stress: 10, knowledge: 3 },
          result: "You pass through Little Italy, smell amazing food. Your feet hurt but the views!",
          nextScene: "downtown_journey",
        },
      ],
    },

    downtown_journey: {
      title: "Through Downtown San Diego",
      icon: "🌆",
      description:
        "You're in downtown San Diego! The historic Gaslamp Quarter's Victorian buildings mix with modern architecture. Street performers entertain crowds. You spot signs directing to 'EDGE AI FOUNDATION' pointing toward a sleek venue ahead.",
      choices: [
        {
          text: "Follow the EDGE AI signs directly",
          icon: "➡️",
          effects: { energy: -5 },
          result: "Straight shot to EVE. You can see the banners now!",
          nextScene: "eve_approach",
        },
        {
          text: "Detour through Gaslamp for a quick look",
          icon: "🏛️",
          effects: { energy: -10, stress: -15, knowledge: 2 },
          result: "Beautiful architecture! You snap photos of the historic buildings.",
          nextScene: "eve_approach",
        },
        {
          text: "Stop for authentic San Diego tacos",
          icon: "🌮",
          cost: 12,
          effects: { money: -12, energy: 20, stress: -10 },
          result: "Fish tacos from a street vendor. This is what California dreams are made of!",
          nextScene: "eve_approach",
        },
        {
          text: "Network with other conference-goers on the street",
          icon: "👥",
          effects: { energy: -5, connections: 2, knowledge: 3 },
          result: "You spot badge lanyards! Introductions lead to promising conversations.",
          nextScene: "eve_approach",
        },
      ],
    },

    eve_approach: {
      title: "Approaching EVE",
      icon: "🎯",
      description:
        "There it is — EVE, the venue for EDGE AI San Diego 2026! A massive banner reads 'EDGE AI FOUNDATION: From tinyML to the Edge of AI'. Attendees stream through the entrance. You see booths, hear presentations, feel the energy. So close!",
      choices: [
        {
          text: "Walk confidently to registration",
          icon: "😎",
          effects: { stress: -20 },
          result: "You made it. Against all odds, delays, and airport chaos — YOU MADE IT!",
          nextScene: "eve_entrance",
        },
        {
          text: "Take a moment to appreciate the journey",
          icon: "🙏",
          effects: { stress: -25, knowledge: 5 },
          result: "From that chaotic airport drop-off to here. What a trail it's been.",
          nextScene: "eve_entrance",
        },
        {
          text: "Sprint the final stretch triumphantly",
          icon: "🏃‍♂️",
          effects: { energy: -10 },
          result: "You burst through like you're crossing a finish line. Because you are!",
          nextScene: "eve_entrance",
        },
      ],
    },

    eve_entrance: {
      title: "Welcome to EDGE AI!",
      icon: "🎉",
      description:
        "You step through the doors of EVE. The registration desk greets you with a warm smile. Your badge is ready. Inside, you hear the buzz of innovation — Qualcomm, Intel, UCSD, DeepX, all here. Keynotes, workshops, demos await. You did it, {playerName}!",
      choices: [
        {
          text: "Accept your badge and enter the conference!",
          icon: "🏆",
          effects: { stress: -50, knowledge: 20, connections: 5 },
          result: "CONGRATULATIONS! You've completed the EDGE AI Trail to San Diego!",
          nextScene: "victory",
        },
      ],
    },
  }

  return scenes[scene] || scenes.airport_dropoff
}
