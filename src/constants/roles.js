// GVR Pharma IMS — Role-Based Permissions
// Controls which UI elements and actions are available per user role

export const ROLES = {
  ADMIN:   'admin',
  MANAGER: 'manager',
  SALES:   'sales',
};

export const PERMISSIONS = {
  admin: {
    canAdd:        true,
    canEdit:       true,
    canDelete:     true,
    canViewAlerts: true,
  },
  manager: {
    canAdd:        false,
    canEdit:       false,
    canDelete:     false,
    canViewAlerts: true,
  },
  sales: {
    canAdd:        false,
    canEdit:       false,
    canDelete:     false,
    canViewAlerts: false,
  },
};

/**
 * Get permissions for a given role.
 * Falls back to sales (most restrictive) if role is unrecognized.
 */
export const getPermissions = (role) => {
  return PERMISSIONS[role] || PERMISSIONS.sales;
};

export default PERMISSIONS;
