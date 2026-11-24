const ActivityLog = require('../models/ActivityLog');
const { handleError } = require('../utils/api');

exports.getActivities = async (req, res) => {
    try {
        const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 300);
        const logs = await ActivityLog.findAll({
            where: { admin_role: 'admin' },
            order: [['createdAt', 'DESC']],
            limit,
        });
        return res.status(200).json(logs);
    } catch (error) {
        return handleError(res, error);
    }
};
