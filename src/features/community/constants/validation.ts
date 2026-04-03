/**
 * Validation Constants
 * Các hằng số cho validation
 */

export const VALIDATION_RULES = {
  POST: {
    TITLE_MIN_LENGTH: 5,
    TITLE_MAX_LENGTH: 2000,
    CONTENT_MIN_LENGTH: 10,
    CONTENT_MAX_LENGTH: 5000,
  },
  
  COMMENT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000,
  },
  
  SEARCH: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  }
} as const;

export const VALIDATION_MESSAGES = {
  POST: {
    TITLE_REQUIRED: 'Vui lòng nhập câu hỏi',
    TITLE_TOO_SHORT: `Câu hỏi phải có ít nhất ${VALIDATION_RULES.POST.TITLE_MIN_LENGTH} ký tự`,
    TITLE_TOO_LONG: `Câu hỏi không được vượt quá ${VALIDATION_RULES.POST.TITLE_MAX_LENGTH} ký tự`,
    CONTENT_REQUIRED: 'Vui lòng nhập mô tả',
    CONTENT_TOO_SHORT: `Mô tả phải có ít nhất ${VALIDATION_RULES.POST.CONTENT_MIN_LENGTH} ký tự`,
    CONTENT_TOO_LONG: `Mô tả không được vượt quá ${VALIDATION_RULES.POST.CONTENT_MAX_LENGTH} ký tự`,
  },
  
  COMMENT: {
    REQUIRED: 'Vui lòng nhập nội dung bình luận',
    TOO_LONG: `Bình luận không được vượt quá ${VALIDATION_RULES.COMMENT.MAX_LENGTH} ký tự`,
  },
  
  SEARCH: {
    TOO_SHORT: `Từ khóa tìm kiếm phải có ít nhất ${VALIDATION_RULES.SEARCH.MIN_LENGTH} ký tự`,
    TOO_LONG: `Từ khóa tìm kiếm không được vượt quá ${VALIDATION_RULES.SEARCH.MAX_LENGTH} ký tự`,
  }
} as const;