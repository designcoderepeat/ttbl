import Types "./types";
import Debug "mo:base/Debug";

module {
    public ChallengeId = Types.ChallengeId;


public class OriginStoryEpic {
    // quest is group of few challenges
    // campaign is a group of few quests
    // epic is a group of campaigns
    public let demoQuest: Epic = {

    };

    public let TTBLOriginStory: [Text] = 
        ["And the whole earth was of one language, and of one speech",
        "And it came to pass, as they journeyed from the east, that they found a plain in the land of Shinar; and they dwelt there",
        "And they said one to another, Go to, let us make brick, and burn them throughly. And they had brick for stone, and slime had they for morter",
        "And they said, Go to, let us build us a city and a tower, whose top may reach unto heaven; and let us make us a name, lest we be scattered abroad upon the face of the whole earth",
        "And the LORD came down to see the city and the tower, which the children of men builded",
        "And the LORD said, Behold, the people is one, and they have all one language; and this they begin to do: and now nothing will be restrained from them, which they have imagined to do",
        "Go to, let us go down, and there confound their language, that they may not understand one another's speech",
        "So the LORD scattered them abroad from thence upon the face of all the earth: and they left off to build the city",
        "Therefore is the name of it called Babel; because the LORD did there confound the language of all the earth: and from thence did the LORD scatter them abroad upon the face of all the earth"]
    ;

    // this operation can be made atomic for extra safety, or each individual item can be stored separately as the map
    public func loadOiginStoryIntoDB(): Text {
        // Populate the challenge database with originStory challenges.

        let demoStoryChallenges: [ChallengeId]  = [];
        let i = 0;
        
        // for (entry in TTBLOriginStory.vals()) {
        //     let challengeId: ChallengeId = challengeCounter.get_new_id();
        //     demoStoryChallenges.push(challengeId);
        //     challengeDB.add(
        //         Challenge.Challenge(
        //         challengeId,
        //         "The Tower Of Babel ", // title
        //         "Learn the Origin Story", // subtitle
        //         entry,
        //         null,
        //         "Lesson",
        //         entry,
        //         null,
        //         null, 
        //         null
        //     ));
        
    };

        Debug.print("Loaded Challenges for Origin Db");
    };

};

};
