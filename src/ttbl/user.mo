import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Types "./types";

module {
  type UserId = Types.UserId;
  type ChallengeId = Types.ChallengeId;
  type UserData = Types.UserData;
  type Location = Types.Location;

  public class UserDb() {
    func isEq(x: UserId, y: UserId): Bool { x == y };

    let db = HashMap.HashMap<UserId, UserData>(1, isEq, Principal.hash);

    public func createOrReturn(userId: UserId, username: Text) :  UserData {
      let maybeUser = db.get(userId);
      if (Option.isSome(maybeUser)) {
        return Option.unwrap(maybeUser)
      };
      let userData = makeUserData(userId, username);
      db.put(userId, userData);
      return userData;
    };

    public func update(userData: UserData) {
      let userId: UserId = userData.id;
      db.put(userId, userData);
    };

    public func findById(userId: UserId): ?UserData {
      db.get(userId)
    };

    public func findByName(username: Text): [UserData] {
      var users: [UserData] = [];
      for ((id, userData) in db.entries()) {
        if (userData.name == username) {
          users := Array.append<UserData>(users, [userData]);
        };
      };
    users
    };

    // Helpers.
    func makeUserData(userId: UserId, username: Text): UserData {
      {
        id = userId;
        name = username;
        location = (0,0);
        challenges = [];
        friends = [];
      }
    };

  }
}
