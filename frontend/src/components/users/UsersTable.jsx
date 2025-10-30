import { Accordion, Table, Button, Spinner, Badge } from "react-bootstrap";
import useIndexUsers from "../../hooks/users/useIndexUsers";
import useDeleteUser from "../../hooks/users/useDeleteUser";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import ConfirmModal from "../common/ConfirmModal";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import UserDetailsModal from "./UserDetailsModal";

function UsersTable() {
  const { users, loading, error, refetch } = useIndexUsers();
  const { remove } = useDeleteUser();
  const { user: loggedUser } = useAuth();

  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const isAdmin = loggedUser?.role === "ADMIN";

  ////////////////////////
  ///// LOADING STATE ////
  ////////////////////////
  if (loading)
    return (
      <div className="text-center p-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-danger p-4">
        <p>Failed to load users. Please try again later.</p>
      </div>
    );

  if (!users || users.length === 0)
    return <p className="text-center mt-4">No users found.</p>;

  ///////////////////////////////
  ///// GROUP USERS BY ROLE /////
  ///////////////////////////////
  const groupedUsers = users.reduce((acc, user) => {
    const role = user.role || "UNKNOWN";
    if (!acc[role]) acc[role] = [];
    acc[role].push(user);
    return acc;
  }, {});

  //////////////////////////////
  ///// HANDLE DELETE USER /////
  //////////////////////////////
  const handleDelete = async () => {
    if (!selectedUser) return;
    await remove(selectedUser._id);
    refetch();
    setShowConfirm(false);
  };

  ///////////////////////////////
  ///// RENDER TABLE BY ROLE ////
  ///////////////////////////////
  const renderTable = (role) => {
    const roleUsers = groupedUsers[role] || [];
    if (roleUsers.length === 0)
      return <p className="text-muted ps-3">No {role.toLowerCase()}s found.</p>;

    return (
      <Table striped bordered hover responsive className="align-middle text-center">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roleUsers.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>
                {user.name} {user.surname || ""}
              </td>
              <td>{user.email}</td>
              <td>
                <Badge bg={user.role === "ADMIN" ? "danger" : "secondary"}>
                  {user.role}
                </Badge>
              </td>
              <td>
                <div className="d-flex justify-content-center gap-2">
                  {/* DETAILS */}
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDetailsModal(true);
                    }}
                  >
                    <i className="bi bi-eye"></i>
                  </Button>

                  {/* EDIT + DELETE visible only for ADMIN */}
                  {isAdmin && (
                    <>
                      <Button
                        size="sm"
                        variant="outline-warning"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowConfirm(true);
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  //////////////////////////
  ///// RETURN LAYOUT ////// 
  //////////////////////////
  return (
    <div className="mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-primary mb-0">Users Management</h2>
        {isAdmin && (
          <Button variant="success" onClick={() => setShowAddModal(true)}>
            <i className="bi bi-plus-circle me-2"></i>Add User
          </Button>
        )}
      </div>

      {/* ACCORDION MULTI-OPEN */}
      <Accordion alwaysOpen>
        {Object.entries(groupedUsers)
          .sort(([roleA], [roleB]) => roleA.localeCompare(roleB))
          .map(([role, list], index) => (
            <Accordion.Item eventKey={index.toString()} key={role}>
              <Accordion.Header>
                <div className="d-flex align-items-center justify-content-between w-100">
                  <span>
                    {role.charAt(0) + role.slice(1).toLowerCase()}
                    <Badge bg="secondary" pill className="ms-2">
                      {list.length}
                    </Badge>
                  </span>
                </div>
              </Accordion.Header>
              <Accordion.Body>{renderTable(role)}</Accordion.Body>
            </Accordion.Item>
          ))}
      </Accordion>

      {/* MODALS */}
      <AddUserModal show={showAddModal} onHide={() => setShowAddModal(false)} refetch={refetch} />
      <EditUserModal show={showEditModal} onHide={() => setShowEditModal(false)} user={selectedUser} refetch={refetch} />
      <UserDetailsModal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} user={selectedUser} />
      <ConfirmModal
        isOpen={showConfirm}
        closeModal={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${selectedUser?.name}?`}
      />
    </div>
  );
}

export default UsersTable;
