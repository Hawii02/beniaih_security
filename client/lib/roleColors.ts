export const roleColors = {
  admin: "bg-linear-to-r from-red-800 to-red-600",
  manager: "bg-linear-to-r from-cyan-800 to-cyan-600",
  guard: "bg-linear-to-r from-blue-800 to-blue-600",
  host: "bg-linear-to-r from-green-800 to-green-600",
  visitor: "bg-linear-to-r from-purple-800 to-purple-600",
};

export function getRoleTextColor(role?: string) {
  switch (role) {
    case "admin":
      return "text-red-600";
      break;
    case "manager":
      return "text-cyan-600";
      break;
    case "guard":
      return "text-blue-600";
      break;
    case "host":
      return "text-green-600";
      break;
    case "visitor":
      return "text-purple-600";
      break;
    default:
      break;
  }
}

export function getHoverRoleColor(role?: string) {
  switch (role) {
    case "admin":
      return "hover:bg-red-500/30 hover:text-red-500";
      break;
    case "manager":
      return "hover:bg-cyan-500/30 hover:text-cyan-500";
      break;
    case "guard":
      return "hover:bg-blue-500/30 hover:text-blue-500";
      break;
    case "host":
      return "hover:bg-green-500/30 hover:text-green-500";
      break;
    case "visitor":
      return "hover:bg-purple-500/30 hover:text-purple-500";
      break;
    default:
      break;
  }
}

export function getRoleBgColor(role?: string) {
  switch (role) {
    case "admin":
      return "bg-red-500/20";
      break;
    case "manager":
      return "bg-cyan-500/20";
      break;
    case "guard":
      return "bg-blue-500/20";
      break;
    case "host":
      return "bg-green-500/20";
      break;
    case "visitor":
      return "bg-purple-500/20";
      break;
    default:
      break;
  }
}
