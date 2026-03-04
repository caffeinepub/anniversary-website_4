import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Array "mo:core/Array";

import Runtime "mo:core/Runtime";


actor {
  type CoupleInfo = {
    partner1Name : Text;
    partner2Name : Text;
    anniversaryDate : Text;
    tagline : Text;
  };

  type TimelineMilestone = {
    title : Text;
    description : Text;
    date : Text;
  };

  type LoveLetter = {
    author : Text;
    recipient : Text;
    content : Text;
  };

  var coupleInfo : CoupleInfo = {
    partner1Name = "Jeeya";
    partner2Name = "Anuj";
    anniversaryDate = "September 25, 2025";
    tagline = "Six months of love, laughter, and forever in the making";
  };

  var loveLetter : LoveLetter = {
    author = "Anuj";
    recipient = "Jeeya";
    content = "My dearest Jeeya,\n\nIt's been six incredible months since that magical day on September 25. These months have been filled with love, laughter, and memories I will forever cherish. Thank you for saying yes to a lifetime of happiness together. I love you endlessly.\n\nForever yours,\nAnuj";
  };

  var timelineMilestones : [TimelineMilestone] = [
    {
      title = "The Proposal";
      description = "On September 25, 2025, Anuj asked the most important question - and Jeeya said yes.";
      date = "September 25, 2025";
    },
    {
      title = "First Month Together";
      description = "October 2025 marked the beginning of their incredible journey.";
      date = "October 2025";
    },
    {
      title = "Holiday Season Together";
      description = "Celebrated a magical holiday season together in December 2025.";
      date = "December 2025";
    },
    {
      title = "6 Month Anniversary";
      description = "March 25, 2026 marks half a year of love, laughter, and growth.";
      date = "March 25, 2026";
    },
  ];

  var reasonsList : [Text] = [
    "Your beautiful smile",
    "Your warmth and kindness",
    "The way you make ordinary moments extraordinary",
    "Being my best friend and confidant",
    "Your unwavering support",
    "Our inside jokes and laughter",
    "The love you give unconditionally",
    "The future we are building together",
  ];

  let adminPrincipal = Principal.fromText("2vxsx-fae");

  func assertIsAdmin(caller : Principal) {
    if (caller != adminPrincipal) {
      Runtime.trap("Access denied: Only admin can perform this action.");
    };
  };

  public query ({ caller }) func getCoupleInfo() : async CoupleInfo {
    coupleInfo;
  };

  public query ({ caller }) func getLoveLetter() : async LoveLetter {
    loveLetter;
  };

  public query ({ caller }) func getTimelineMilestones() : async [TimelineMilestone] {
    timelineMilestones;
  };

  public query ({ caller }) func getReasonsList() : async [Text] {
    reasonsList;
  };

  public shared ({ caller }) func updateCoupleInfo(newInfo : CoupleInfo) : async () {
    assertIsAdmin(caller);
    coupleInfo := newInfo;
  };

  public shared ({ caller }) func updateLoveLetter(newLetter : LoveLetter) : async () {
    assertIsAdmin(caller);
    loveLetter := newLetter;
  };

  public shared ({ caller }) func updateTimelineMilestones(newMilestones : [TimelineMilestone]) : async () {
    assertIsAdmin(caller);
    timelineMilestones := newMilestones;
  };

  public shared ({ caller }) func updateReasonsList(newReasons : [Text]) : async () {
    assertIsAdmin(caller);
    reasonsList := newReasons;
  };
};
