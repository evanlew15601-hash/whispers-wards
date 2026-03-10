VAR cc_node_id = ""
VAR cc_speaker = ""
VAR cc_faction = ""

// Mirrors the TS game state for conditionals.
VAR rep_iron_pact = 0
VAR rep_verdant_court = 0
VAR rep_ember_throne = 0

-> opening

=== opening ===
~ cc_node_id = "ink:opening"
~ cc_speaker = "Commander Aldric Vane"
~ cc_faction = "iron-pact"
Dusk deepens over Concord Hall, torchlight pooling in the carved stone like molten gold.
A man in iron-gray livery waits at the threshold of the council chamber, posture sharp as a drawn blade.
"Envoy," he says. "Seventeen are dead along the Greenmarch Pass. The Verdant Court blames the Iron Pact. The Ember Throne laughs behind its curtains." His gaze pins you. "Which did you ride in on?"

+ ["Words first, Commander. Let me hear the Court before we draw steel."] #id:diplomatic #rep:iron-pact:-5 #rep:verdant-court:10 #res:influence:+1 #milestone:ink:diplomatic-open
  -> aldric_diplomatic

+ ["Tell me what you need—without the ceremony."] #id:pragmatic #rep:iron-pact:10
  -> aldric_pragmatic

+ ["Seventeen dead is a story. Who's shaping it?"] #id:information #rep:iron-pact:-3 #rep:ember-throne:5 #reveal:The border deaths suggest someone is provoking conflict.
  -> aldric_suspicious

=== aldric_diplomatic ===
~ cc_node_id = "ink:aldric-diplomatic"
~ cc_speaker = "Commander Aldric Vane"
~ cc_faction = "iron-pact"
Aldric's jaw tightens, but he inclines his head.
"The Court's envoy arrives tomorrow. Thessaly Rith—silver tongue, green banners." He gestures to the map of the Pass. "If you can keep her from making this a tribunal, we may yet avert war."

+ ["Tell me about Thessaly."] #id:ask-about-thessaly
  -> thessaly_intro

+ ["Understood. I'll speak with her."] #id:thank-proceed
  -> thessaly_intro

=== aldric_pragmatic ===
~ cc_node_id = "ink:aldric-pragmatic"
~ cc_speaker = "Commander Aldric Vane"
~ cc_faction = "iron-pact"
Aldric exhales through his nose, almost a laugh.
"Good. Then listen. I need a ceasefire at the Pass and a lie that the Court will swallow." He taps the map. "If we show restraint, they call it weakness. If we march, they call it proof." His eyes narrow. "Find me leverage. Evidence. Or an angle that makes them hesitate."

+ ["I'll start with the maps. Someone forged the border lines."] #id:pragmatic-maps #goto:map-revelation
  -> END

+ ["I'll hunt motives—Ember Throne, smugglers, anyone who benefits."] #id:pragmatic-motives #goto:ember-motives
  -> END

=== aldric_suspicious ===
~ cc_node_id = "ink:aldric-suspicious"
~ cc_speaker = "Commander Aldric Vane"
~ cc_faction = "iron-pact"
For the first time, Aldric looks past you—at the chamber doors, at the painted windows.
"The story is already set," he murmurs. "The Ember Throne has coin in every ear. The Court has grief. And my generals have pride." He meets your gaze again. "If you want to know who's shaping it, you'll need to step into the mud where it began."

+ ["Then I'll call on the Ember Throne's agents here in the Hall."] #id:suspicious-accuse #goto:ember-accusation
  -> END

+ ["I'll start at the Pass. I want names, routes, witnesses."] #id:suspicious-investigate #goto:investigation-start
  -> END

=== thessaly_intro ===
~ cc_node_id = "ink:thessaly-intro"
~ cc_speaker = "Envoy Thessaly Rith"
~ cc_faction = "verdant-court"
Thessaly Rith arrives with the dawn—verdant cloak, smiling eyes, and guards that never stop measuring the room.
"Envoy," she greets you, voice warm as summer wine. "I hear Concord has appointed a peacemaker." Her smile sharpens. "Tell me, will you offer justice… or compromise?"

+ ["Justice. The killings must be answered for."] #id:thessaly-justice #goto:thessaly-honest
  -> END

+ ["Compromise. If we can stop the bloodshed, the rest can follow."] #id:thessaly-compromise #goto:thessaly-strategic
  -> END
