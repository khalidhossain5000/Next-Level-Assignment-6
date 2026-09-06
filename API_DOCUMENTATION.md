# Load Shedding & Power Management API

## Overview

- Base path: `/api/v1`
- Total route endpoints: **44**
- Authentication: protected endpoints accept an access token from the `accessToken` cookie or an `Authorization` header.
- Access labels: `Public`, `Customer only`, `Technician only`, `Admin only`, or the listed role combination.

## 1. Auth APIs

1. `POST /api/v1/auth/register` - Create a new user account. **Public**
2. `POST /api/v1/auth/verify-email` - Verify a user's email address. **Public**
3. `POST /api/v1/auth/login` - Log in a user and issue authentication tokens. **Public**
4. `POST /api/v1/auth/refresh-token` - Refresh the user's access token. **Public**
5. `POST /api/v1/auth/google-login` - Log in or register through Google authentication. **Public**
6. `PATCH /api/v1/auth/update-profile` - Update the authenticated user's profile information and profile image. **Admin, Customer, or Technician**
7. `GET /api/v1/auth/get-me` - Get the authenticated user's profile. **Admin, Customer, or Technician**

## 2. Technician Profile APIs

8. `PATCH /api/v1/technician` - Update the authenticated technician's profile and resume. **Technician only**

## 3. Zone APIs

9. `POST /api/v1/zone` - Create a distribution zone with an optional zone image. **Admin only**
10. `PATCH /api/v1/zone/:zoneId` - Update a distribution zone and optionally replace its image. **Admin only**
11. `GET /api/v1/zone` - Get all distribution zones. **Public**
12. `GET /api/v1/zone/:zoneId` - Get details of a specific distribution zone. **Public**

## 4. Substation APIs

13. `POST /api/v1/substation` - Create a distribution substation. **Admin only**
14. `PATCH /api/v1/substation/:substationId` - Update a distribution substation. **Admin only**
15. `GET /api/v1/substation` - Get all substations. **Public**
16. `GET /api/v1/substation/:substationId` - Get details of a specific substation. **Public**

## 5. Feeder APIs

17. `POST /api/v1/feeder` - Create a distribution feeder. **Admin only**
18. `GET /api/v1/feeder` - Get all feeders. **Public**
19. `GET /api/v1/feeder/:feederId` - Get details of a specific feeder. **Public**

## 6. Area APIs

20. `POST /api/v1/area` - Create a distribution area. **Admin only**
21. `GET /api/v1/area` - Get all distribution areas. **Public**
22. `GET /api/v1/area/:areaId` - Get details of a specific area. **Admin, Customer, or Technician**

## 7. Unexpected Outage APIs

23. `POST /api/v1/outage` - Report an unexpected power outage. **Customer only**
24. `GET /api/v1/outage` - Get all reported outages for administrative management. **Admin only**
25. `GET /api/v1/outage` - Get outages reported by the authenticated customer. **Customer only**
26. `PATCH /api/v1/outage/:outageId/assign-technician` - Assign a technician to a reported outage. **Admin only**
27. `PATCH /api/v1/outage/:outageId/status` - Update an outage's status according to the workflow. **Admin or Technician**

## 8. Load Shedding APIs

28. `POST /api/v1/load-shedding` - Create a load-shedding schedule. **Admin only**
29. `GET /api/v1/load-shedding` - Get all load-shedding schedules. **Public**
30. `GET /api/v1/load-shedding/:loadsheddingId` - Get details of a load-shedding schedule. **Admin, Customer, or Technician**
31. `PATCH /api/v1/load-shedding/:loadsheddingId` - Update a load-shedding schedule. **Admin only**

## 9. Payment APIs

32. `POST /api/v1/payment/create` - Create a payment for the authenticated customer. **Customer only**
33. `POST /api/v1/payment/confirm` - Confirm and verify an SSLCommerz payment. **Public**
34. `GET /api/v1/payment` - Get the authenticated customer's payment history. **Customer only**
35. `GET /api/v1/payment/:paymentId` - Get payment details. **Admin or Customer**

## 10. Planned Outage APIs

36. `POST /api/v1/planned-outage` - Create a planned outage schedule. **Admin only**
37. `GET /api/v1/planned-outage` - Get all planned outage schedules. **Public**
38. `GET /api/v1/planned-outage/:plannedOutageId` - Get details of a planned outage. **Customer only**
39. `PATCH /api/v1/planned-outage/:plannedOutageId` - Update a planned outage schedule. **Admin only**

## 11. Admin APIs

40. `GET /api/v1/admin/users` - Get users with search and filtering for administration. **Admin only**
41. `PATCH /api/v1/admin/users/:userId` - Update a user's status, such as banning or unbanning the user. **Admin only**
42. `GET /api/v1/admin/technician` - Get technician users for management and outage assignment. **Admin only**
43. `GET /api/v1/admin/users` - Reserved analytics or overall user-report endpoint registration. **Admin only**
44. `GET /api/v1/admin/payment-record` - Get payment records with search and pagination for administration. **Admin only**

## Count Summary

| Module | Endpoint count |
| --- | ---: |
| Auth | 7 |
| Technician Profile | 1 |
| Zone | 4 |
| Substation | 4 |
| Feeder | 3 |
| Area | 3 |
| Unexpected Outage | 5 |
| Load Shedding | 4 |
| Payment | 4 |
| Planned Outage | 4 |
| Admin | 5 |
| **Total** | **44** |

## Notes

- The two `GET /api/v1/outage` registrations are listed separately because they are separate route declarations with different access rules and controller actions.
- The two `GET /api/v1/admin/users` registrations are also listed separately because both are declared in the route file. The second one currently has no controller handler attached.
- This document describes the routes currently registered in the source code, including endpoints whose business logic may still be incomplete.