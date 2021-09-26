import Nat = "mo:base/Nat";
import Nat32 = "mo:base/Nat32";

module {
  public func new() : { next : () -> Nat } =
    object {
      let modulus = 0x7fffffff;
      var state : Nat32 = 1;

      public func next() : Nat
      {
        state := Nat32.fromNat(Nat32.toNat(state) * 48271 % modulus);
        Nat32.toNat(state);
      };

    };
};
